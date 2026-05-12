const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/* =========================
   TEST AUTH
========================= */
router.get('/test-auth', authMiddleware, (req, res) => {
  res.json({
    message: 'Auth works',
    user: req.user,
  });
});

/* =========================
   TEST ADMIN
========================= */
router.get(
  '/test-admin',
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: 'Admin access granted',
    });
  }
);

module.exports = router;