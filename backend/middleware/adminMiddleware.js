// backend/middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  try {
    // Check role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admins only.',
      });
    }

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

module.exports = adminMiddleware;