const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 */

// Like a post
const likePost = async ({ user_id, post_id }) => {
  const sql = `
    INSERT INTO likes (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await query(sql, [user_id, post_id]);
  return result.rows[0];
};

// Unlike a post
const unlikePost = async ({ user_id, post_id }) => {
  const sql = `
    DELETE FROM likes
    WHERE user_id = $1 AND post_id = $2
    RETURNING *;
  `;
  const result = await query(sql, [user_id, post_id]);
  return result.rows[0];
};

// Get all likes for a post
const getPostLikes = async (post_id) => {
  const sql = `
    SELECT u.id, u.username, u.full_name
    FROM likes l
    JOIN users u ON l.user_id = u.id
    WHERE l.post_id = $1;
  `;
  const result = await query(sql, [post_id]);
  return result.rows;
};

// Get all posts liked by a user
const getUserLikes = async (user_id) => {
  const sql = `
    SELECT p.id, p.content, p.media_url, p.created_at
    FROM likes l
    JOIN posts p ON l.post_id = p.id
    WHERE l.user_id = $1;
  `;
  const result = await query(sql, [user_id]);
  return result.rows;
};

// Check if a user has liked a specific post
const hasUserLikedPost = async ({ user_id, post_id }) => {
  const sql = `
    SELECT 1
    FROM likes
    WHERE user_id = $1 AND post_id = $2
    LIMIT 1;
  `;
  const result = await query(sql, [user_id, post_id]);
  return result.rows.length > 0;
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
};
