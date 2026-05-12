require('dotenv').config();

const http = require('http');
const socketio = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');

const app = require('./app');
const { notificationSocket } = require('./sockets/notificationSocket');
const adminRoutes = require('./routes/adminRoutes');

const PORT = process.env.PORT || 5000;

// ----------------------------------
// HTTP Server
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

// ----------------------------------
// Initialize Socket Events
// ----------------------------------
notificationSocket(io);

// ----------------------------------
// Inject io into admin routes
// ----------------------------------
adminRoutes.init(io);

// ----------------------------------
// Global Agent State
// ----------------------------------
global._agentRunning = false;

// ----------------------------------
// Run AI Agent Function
// ----------------------------------
function runAgent(trigger = 'manual') {
  return new Promise((resolve) => {
    if (global._agentRunning) {
      console.log('⚠️ AI agent already running.');

      if (io) {
        io.emit('agent-log', {
          type: 'warning',
          message: '⚠️ AI agent already running.',
        });
      }

      return resolve(false);
    }

    console.log(`🚀 Starting AI agent (${trigger})...`);

    global._agentRunning = true;

    if (io) {
      io.emit('agent-log', {
        type: 'start',
        message: `🚀 AI agent started (${trigger})...`,
      });
    }

    const agent = spawn(
      process.env.PYTHON_PATH || 'python3',
      [path.join(__dirname, 'agent/run_agent.py')],
      {
        cwd: __dirname,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );

    // ----------------------------------
    // STDOUT
    // ----------------------------------
    agent.stdout.on('data', (data) => {
      data
        .toString()
        .trim()
        .split('\n')
        .forEach((line) => {
          if (!line.trim()) return;

          console.log(`[AI AGENT]: ${line}`);

          if (io) {
            io.emit('agent-log', {
              type: 'stdout',
              message: line.trim(),
            });
          }
        });
    });

    // ----------------------------------
    // STDERR
    // ----------------------------------
    agent.stderr.on('data', (data) => {
      data
        .toString()
        .trim()
        .split('\n')
        .forEach((line) => {
          if (!line.trim()) return;

          console.error(`[AI AGENT ERROR]: ${line}`);

          if (io) {
            io.emit('agent-log', {
              type: 'stderr',
              message: `⚠️ ${line.trim()}`,
            });
          }
        });
    });

    // ----------------------------------
    // CLOSE
    // ----------------------------------
    agent.on('close', (code) => {
      global._agentRunning = false;

      if (code === 0) {
        console.log('✅ AI agent finished successfully.');

        if (io) {
          io.emit('agent-log', {
            type: 'done',
            message: '✅ AI agent finished successfully.',
          });
        }
      } else {
        console.error(`❌ AI agent exited with code ${code}`);

        if (io) {
          io.emit('agent-log', {
            type: 'error',
            message: `❌ AI agent exited with code ${code}`,
          });
        }
      }

      resolve(true);
    });

    // ----------------------------------
    // ERROR
    // ----------------------------------
    agent.on('error', (err) => {
      global._agentRunning = false;

      console.error('❌ Failed to start AI agent:', err);

      if (io) {
        io.emit('agent-log', {
          type: 'error',
          message: `❌ Failed to start AI agent: ${err.message}`,
        });
      }

      resolve(false);
    });
  });
}

// ----------------------------------
// Auto-run every 30 minutes
// ----------------------------------
function scheduleAutoRun() {
  setTimeout(async () => {
    await runAgent('auto-schedule');

    // Schedule next run after completion
    scheduleAutoRun();
  }, 30 * 60 * 1000);
}

// ----------------------------------
// Health Check Route
// ----------------------------------
app.get('/', (req, res) => {
  res.send('🚀 TopNews API Running');
});

// ----------------------------------
// Start Server
// ----------------------------------
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  // Start auto scheduler
  scheduleAutoRun();
});