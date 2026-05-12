require('dotenv').config();
const http = require('http');
const socketio = require('socket.io');

const app = require('./app');
const { notificationSocket } = require('./sockets/notificationSocket');
const adminRoutes = require('./routes/adminRoutes');

const PORT = process.env.PORT || 5000;

// ----------------------------------
// HTTP server
// ----------------------------------
const server = http.createServer(app);

// ----------------------------------
// Socket.IO
// ----------------------------------
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

// Initialize socket events
notificationSocket(io);

// Inject io into adminRoutes BEFORE the server starts
// This is what makes _io available when /trigger-agent fires
adminRoutes.init(io);

// ----------------------------------
// Auto-run every 30 minutes
// Only starts if no manual run is active
// ----------------------------------
function scheduleAutoRun() {
  setTimeout(async () => {
    if (!global._agentRunning) {
      console.log('⏰ Auto-running AI agent (30-min schedule)...');

      // Re-use the same spawn logic by importing it here
      // so it goes through the same _io emitter
      const { spawn } = require('child_process');
      const path = require('path');

      global._agentRunning = true;

      if (io) io.emit('agent-log', { type: 'start', message: '⏰ Auto-scheduled agent run starting...' });

      const agent = spawn(
        'python',
        [path.join(__dirname, 'agent/run_agent.py')],
        {
          cwd: __dirname,
          stdio: ['ignore', 'pipe', 'pipe'],
        }
      );

      agent.stdout.on('data', (data) => {
        data.toString().trim().split('\n').forEach((line) => {
          if (!line.trim()) return;
          console.log(`[Auto Agent]: ${line}`);
          if (io) io.emit('agent-log', { type: 'stdout', message: line.trim() });
        });
      });

      agent.stderr.on('data', (data) => {
        data.toString().trim().split('\n').forEach((line) => {
          if (!line.trim()) return;
          console.error(`[Auto Agent Error]: ${line}`);
          if (io) io.emit('agent-log', { type: 'stderr', message: `⚠️ ${line.trim()}` });
        });
      });

      agent.on('close', (code) => {
        global._agentRunning = false;
        if (io) {
          if (code === 0) {
            io.emit('agent-log', { type: 'done', message: '✅ Auto-run finished.' });
          } else {
            io.emit('agent-log', { type: 'error', message: `❌ Auto-run exited with code ${code}` });
          }
        }
        scheduleAutoRun(); // schedule the NEXT run only after this one finishes
      });

      agent.on('error', (err) => {
        global._agentRunning = false;
        console.error('Auto agent failed to start:', err);
        if (io) io.emit('agent-log', { type: 'error', message: `❌ Auto-run failed: ${err.message}` });
        scheduleAutoRun();
      });

    } else {
      console.log('⏰ Auto-run skipped — agent already running.');
      scheduleAutoRun(); // still reschedule even if skipped
    }
  }, 30 * 60 * 1000); // 30 minutes
}

// ----------------------------------
// Start server
// ----------------------------------
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  global._agentRunning = false; // ensure clean state on boot
  scheduleAutoRun();             // queue first auto-run in 30 min
});