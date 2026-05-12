const express = require('express');
const path = require('path');
const db = require('../config/db');

const router = express.Router();

/* =====================================================
   STATIC FILES (SERVE UPLOADS)
===================================================== */
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* =====================================================
   CREATE POST
===================================================== */
exports.createPost = async (req, res) => {
  const user_id = req.user.id;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Empty request body' });
  }

  const {
    title,
    snippet,
    body,
    image_url,
    video_url,
    category_id,
    tags,
    is_ai
  } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'title and body required' });
  }

  const isAI = Boolean(is_ai);
  const status = isAI ? 'approved' : 'pending';

  let safeImageUrl = null;
  if (image_url) {
    if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
      safeImageUrl = image_url;
    } else {
      const cleanPath = image_url.replace(/^\/+/, '').replace(/^uploads\/+/, '');
      safeImageUrl = `${req.protocol}://${req.get('host')}/uploads/${cleanPath}`;
    }
  }

  let safeVideoUrl = null;
  if (video_url) {
    if (video_url.startsWith('http://') || video_url.startsWith('https://')) {
      safeVideoUrl = video_url;
    } else {
      const cleanPath = video_url.replace(/^\/+/, '').replace(/^uploads\/+/, '');
      safeVideoUrl = `${req.protocol}://${req.get('host')}/uploads/${cleanPath}`;
    }
  }

  try {
    const postRes = await db.query(
      `INSERT INTO posts
        (user_id, title, snippet, body, image_url, video_url, category_id, is_ai, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [user_id, title, snippet || null, body, safeImageUrl, safeVideoUrl, category_id || null, isAI, status]
    );

    const postId = postRes.rows[0].id;

    if (Array.isArray(tags) && tags.length > 0) {
      const existing = await db.query(
        `SELECT id, name FROM tags WHERE name = ANY($1)`, [tags]
      );
      const tagMap = {};
      existing.rows.forEach(tag => { tagMap[tag.name] = tag.id; });

      const newTags = tags.filter(tag => !tagMap[tag]);
      if (newTags.length > 0) {
        const insert = await db.query(
          `INSERT INTO tags (name) SELECT UNNEST($1::text[]) RETURNING id, name`, [newTags]
        );
        insert.rows.forEach(tag => { tagMap[tag.name] = tag.id; });
      }

      for (const tag of tags) {
        if (!tagMap[tag]) continue;
        await db.query(
          `INSERT INTO post_tags (post_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
          [postId, tagMap[tag]]
        );
      }
    }

    res.json({
      message: isAI ? 'AI post auto-approved' : 'Post sent for admin approval',
      post: postRes.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   LIST POSTS (ONLY APPROVED)
   — JOIN users to get author name + avatar + author_id
===================================================== */
exports.listPosts = async (req, res) => {
  try {
    const { category, search, limit = 6, offset = 0 } = req.query;

    const params = [];
    let idx = 1;
    const where = [`p.status = 'approved'`];

    if (category) {
      where.push(`p.category_id = $${idx++}`);
      params.push(category);
    }

    if (search) {
      where.push(`p.title ILIKE $${idx++}`);
      params.push(`%${search}%`);
    }

    const query = `
      SELECT
        p.*,
        p.user_id    AS author_id,
        c.name       AS category,
        u.username   AS author,
        u.avatar_url AS author_avatar_url
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u      ON p.user_id = u.id
      WHERE ${where.join(' AND ')}
      ORDER BY p.created_at DESC
      LIMIT $${idx++}
      OFFSET $${idx++}
    `;

    params.push(limit, offset);
    const { rows } = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET SINGLE POST
   — FIX: explicitly return author_id for frontend
===================================================== */
exports.getPostById = async (req, res) => {
  const postId = Number(req.params.id);

  if (!postId) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const { rows } = await db.query(
      `SELECT
        p.*,
        p.user_id    AS author_id,
        c.name       AS category,
        u.username   AS author,
        u.avatar_url AS author_avatar_url
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u      ON p.user_id = u.id
       WHERE p.id = $1
       AND p.status = 'approved'`,
      [postId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   ADMIN: PENDING POSTS
===================================================== */
exports.getPendingPosts = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT
        p.*,
        p.user_id    AS author_id,
        u.username   AS author,
        u.avatar_url AS author_avatar_url
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.status = 'pending'
       AND p.is_ai = false
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   ADMIN APPROVE / REJECT
===================================================== */
exports.approvePost = async (req, res) => {
  try {
    await db.query(`UPDATE posts SET status = 'approved' WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Post approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    await db.query(`UPDATE posts SET status = 'rejected' WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Post rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   LIKES / DISLIKES COUNT — FIX: real data not stubs
===================================================== */
exports.getLikesDislikesCount = async (req, res) => {
  const postId = Number(req.params.id);
  try {
    const { rows } = await db.query(
      `SELECT
        COUNT(*) FILTER (WHERE type = 'like')    AS likes,
        COUNT(*) FILTER (WHERE type = 'dislike') AS dislikes
       FROM likes_dislikes
       WHERE post_id = $1`,
      [postId]
    );
    res.json({
      likes: parseInt(rows[0].likes, 10),
      dislikes: parseInt(rows[0].dislikes, 10)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET USER REACTION — FIX: real data not stub
===================================================== */
exports.getUserReaction = async (req, res) => {
  if (!req.user) return res.json({ reaction: null });

  const postId = Number(req.params.id);
  const userId = req.user.id;

  try {
    const { rows } = await db.query(
      `SELECT type FROM likes_dislikes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    res.json({ reaction: rows.length ? rows[0].type : null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   LIKE / DISLIKE POST — FIX: real data not stub
===================================================== */
exports.likeDislikePost = async (req, res) => {
  const user_id = req.user.id;
  const { post_id, type } = req.body;

  if (!post_id || !['like', 'dislike'].includes(type)) {
    return res.status(400).json({ message: 'Post ID and valid type required' });
  }

  try {
    const existing = await db.query(
      `SELECT * FROM likes_dislikes WHERE post_id = $1 AND user_id = $2`,
      [post_id, user_id]
    );

    if (existing.rows.length > 0) {
      if (existing.rows[0].type === type) {
        await db.query(
          `DELETE FROM likes_dislikes WHERE post_id = $1 AND user_id = $2`,
          [post_id, user_id]
        );
        return res.json({ message: `${type} removed` });
      } else {
        await db.query(
          `UPDATE likes_dislikes SET type = $1 WHERE post_id = $2 AND user_id = $3`,
          [type, post_id, user_id]
        );
        return res.json({ message: `Changed to ${type}` });
      }
    } else {
      await db.query(
        `INSERT INTO likes_dislikes (post_id, user_id, type) VALUES ($1, $2, $3)`,
        [post_id, user_id, type]
      );
      return res.json({ message: `${type} added` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};