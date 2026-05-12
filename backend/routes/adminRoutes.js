const express = require('express');
const router = express.Router();
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../config/db');

let _io = null;
router.init = (io) => {
  _io = io;
  console.log('✅ adminRoutes: Socket.IO injected');
};

const emit = (type, message) => {
  console.log(`[emit → ${type}]: ${message}`);
  if (_io) _io.emit('agent-log', { type, message });
};

/* =====================================================
   DASHBOARD STATS
===================================================== */
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users)                               AS users,
        (SELECT COUNT(*) FROM posts)                               AS posts,
        (SELECT COUNT(*) FROM posts WHERE is_ai = true)            AS "aiPosts",
        (SELECT COUNT(*) FROM posts WHERE is_ai = false)           AS "userPosts",
        (SELECT COUNT(*) FROM posts WHERE status = 'pending'
          AND is_ai = false)                                       AS pending
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   AGENT STATUS
===================================================== */
router.get('/agent-status', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ running: !!global._agentRunning });
});

/* =====================================================
   MANUAL AI AGENT TRIGGER
===================================================== */
router.post('/trigger-agent', authMiddleware, adminMiddleware, (req, res) => {
  if (global._agentRunning) {
    return res.status(409).json({ message: '⚠️ Agent is already running, please wait.' });
  }

  // ✅ Points to run_agent.py which fetches AND writes to DB
  const agentPath = path.join(__dirname, '../agent/run_agent.py');

  if (!fs.existsSync(agentPath)) {
    const msg = `❌ run_agent.py not found at: ${agentPath}`;
    console.error(msg);
    return res.status(500).json({ message: msg });
  }

  // python on Windows, python3 on Linux/Mac (Render uses Linux)
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

  global._agentRunning = true;

  res.json({ message: '✅ AI Agent triggered! Watch the live log below.' });

  emit('start', `🚀 Agent starting... (${pythonCmd} ${agentPath})`);

  const agent = spawn(
    pythonCmd,
    [agentPath],
    {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    }
  );

  let stdoutBuffer = '';
  agent.stdout.on('data', (data) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split('\n');
    stdoutBuffer = lines.pop();
    lines.forEach((line) => {
      if (line.trim()) emit('stdout', line.trim());
    });
  });

  let stderrBuffer = '';
  agent.stderr.on('data', (data) => {
    stderrBuffer += data.toString();
    const lines = stderrBuffer.split('\n');
    stderrBuffer = lines.pop();
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`[Agent stderr]: ${line.trim()}`);
        emit('stderr', `⚠️ ${line.trim()}`);
      }
    });
  });

  agent.on('close', (code) => {
    if (stdoutBuffer.trim()) emit('stdout', stdoutBuffer.trim());
    if (stderrBuffer.trim()) emit('stderr', `⚠️ ${stderrBuffer.trim()}`);

    global._agentRunning = false;
    console.log(`[Agent] finished with exit code ${code}`);

    if (code === 0) {
      emit('done', '✅ Agent finished. Refresh to see new articles.');
    } else {
      emit('error', `❌ Agent exited with code ${code} — check server logs for details.`);
    }
  });

  agent.on('error', (err) => {
    global._agentRunning = false;
    console.error('Failed to spawn agent process:', err);
    if (err.code === 'ENOENT') {
      emit('error', `❌ "${pythonCmd}" not found. Is Python installed and on PATH?`);
    } else {
      emit('error', `❌ Spawn error: ${err.message}`);
    }
  });
});

/* =====================================================
   GET ALL USERS
===================================================== */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, role FROM users ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   DELETE USER
===================================================== */
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await db.query('SELECT role FROM users WHERE id=$1', [req.params.id]);
    if (!user.rows.length)
      return res.status(404).json({ message: 'User not found' });
    if (user.rows[0].role === 'admin')
      return res.status(403).json({ message: 'Cannot delete admin user' });

    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   GET ALL POSTS
===================================================== */
router.get('/posts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =====================================================
   DELETE POST
===================================================== */
router.delete('/posts/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const post = await db.query('SELECT id FROM posts WHERE id=$1', [req.params.id]);
    if (!post.rows.length)
      return res.status(404).json({ message: 'Post not found' });

    await db.query('DELETE FROM posts WHERE id=$1', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;