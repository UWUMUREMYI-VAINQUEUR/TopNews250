// backend/routes/ogRoute.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/post/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, snippet, image_url FROM posts WHERE id = $1`,
      [req.params.id]
    );

    const post = result.rows[0];
    if (!post) return res.status(404).send('Not found');

    const image = post.image_url || 'https://topnews250.com/tn.png';
    const url = `https://topnews250.com/post/${post.id}`;

    res.send(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${post.title}</title>

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.snippet || ''}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="TopNews" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.snippet || ''}" />
    <meta name="twitter:image" content="${image}" />

    <!-- Redirect real users to the SPA -->
    <script>window.location.href = "${url}"</script>
  </head>
  <body>
    <p>Redirecting to <a href="${url}">${post.title}</a>...</p>
  </body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;