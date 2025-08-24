const { query } = require("../utils/database");

/**
 * Post model for database operations
 */

/**
 * Create a new post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
const createPost = async ({
  user_id,
  content,
  media_url,
  comments_enabled = true,
}) => {
  const result = await query(
    `INSERT INTO posts (user_id, content, media_url, comments_enabled, created_at, is_deleted)
     VALUES ($1, $2, $3, $4, NOW(), false)
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, is_deleted`,
    [user_id, content, media_url, comments_enabled],
  );

  return result.rows[0];
};

/**
 * Get post by ID
 * @param {number} postId - Post ID
 * @returns {Promise<Object|null>} Post object or null
 */
const getPostById = async (postId) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.is_deleted = false`,
    [postId],
  );

  return result.rows[0] || null;
};

/**
 * Get posts by user ID
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
const getPostsByUserId = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id = $1 AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};

/**
 * Delete a post (soft delete)
 * @param {number} postId - Post ID
 * @param {number} userId - User ID (for ownership verification)
 * @returns {Promise<boolean>} Success status
 */
const deletePost = async (postId, userId) => {
  const result = await query(
    "UPDATE posts SET is_deleted = true WHERE id = $1 AND user_id = $2",
    [postId, userId],
  );

  return result.rowCount > 0;
};

/**
 * Get feed posts (from followed users)
 * @param {number} userId - Current user ID
 * @param {number} limit - Number of posts
 * @param {number} offset - Pagination offset
 * @returns {Promise<Array>} Array of posts
 */
const getFeedPosts = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.user_id IN (
       SELECT following_id FROM follows WHERE follower_id = $1
     )
     AND p.is_deleted = false
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return result.rows;
};

/**
 * Update a post (only by owner)
 * @param {Object} postData - Updated post fields
 * @returns {Promise<Object|null>} Updated post or null
 */
const updatePostModel = async ({ id, user_id, content, media_url, comments_enabled }) => {
  const result = await query(
    `UPDATE posts
     SET content = COALESCE($3, content),
         media_url = COALESCE($4, media_url),
         comments_enabled = COALESCE($5, comments_enabled),
         updated_at = NOW()
     WHERE id = $1 AND user_id = $2 AND is_deleted = false
     RETURNING id, user_id, content, media_url, comments_enabled, created_at, updated_at`,
    [id, user_id, content, media_url, comments_enabled],
  );

  return result.rows[0] || null;
};

/**
 * Search posts by content keyword
 * @param {string} term - Search term
 * @param {number} limit - Number of posts
 * @param {number} offset - Pagination offset
 * @returns {Promise<Array>} Array of matching posts
 */
const searchPostsModel = async (term, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT p.*, u.username, u.full_name
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.is_deleted = false
       AND p.content ILIKE $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${term}%`, Number(limit), Number(offset)],
  );

  return result.rows;
};

module.exports = {
  createPost,
  getPostById,
  getPostsByUserId,
  deletePost,
  getFeedPosts,
  updatePostModel,
  searchPostsModel,
};
