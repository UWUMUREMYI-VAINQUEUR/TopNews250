const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

const authMiddleware = require('../middleware/authMiddleware');

/* =====================================================
   VALIDATE POST ID
===================================================== */
const validatePostId = (req, res, next) => {

  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  next();
};

/* =====================================================
   LIST POSTS
===================================================== */
router.get(
  '/',
  postController.listPosts
);

/* =====================================================
   CREATE POST
===================================================== */
router.post(
  '/',
  authMiddleware,
  postController.createPost
);

/* =====================================================
   ADMIN - PENDING POSTS
===================================================== */
router.get(
  '/pending',
  postController.getPendingPosts
);

/* =====================================================
   ADMIN - APPROVE POST
===================================================== */
router.put(
  '/approve/:id',
  validatePostId,
  postController.approvePost
);

/* =====================================================
   ADMIN - REJECT POST
===================================================== */
router.put(
  '/reject/:id',
  validatePostId,
  postController.rejectPost
);

/* =====================================================
   POST REACTIONS
===================================================== */
router.get(
  '/:id/likes-dislikes-count',
  validatePostId,
  postController.getLikesDislikesCount
);

router.get(
  '/:id/user-reaction',
  authMiddleware,
  validatePostId,
  postController.getUserReaction
);

router.post(
  '/:id/like',
  authMiddleware,
  validatePostId,
  postController.likeDislikePost
);

/* =====================================================
   GET SINGLE POST
===================================================== */
router.get(
  '/:id',
  validatePostId,
  postController.getPostById
);

module.exports = router;