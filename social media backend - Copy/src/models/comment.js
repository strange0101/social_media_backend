const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 */

// Create a new comment
const createComment = async ({ user_id, post_id, text }) => {
  const sql = `
    INSERT INTO comments (user_id, post_id, text)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await query(sql, [user_id, post_id, text]);
  return result.rows[0];
};

// Update an existing comment
const updateComment = async ({ comment_id, user_id, text }) => {
  const sql = `
    UPDATE comments
    SET text = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
    RETURNING *;
  `;
  const result = await query(sql, [text, comment_id, user_id]);
  return result.rows[0];
};

// Delete a comment (soft delete)
const deleteComment = async ({ comment_id, user_id }) => {
  const sql = `
    UPDATE comments
    SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE
    RETURNING *;
  `;
  const result = await query(sql, [comment_id, user_id]);
  return result.rows[0];
};

// Get all comments for a post
const getPostComments = async (post_id) => {
  const sql = `
    SELECT c.id, c.text, c.created_at, u.id AS user_id, u.username, u.full_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1 AND c.is_deleted = FALSE
    ORDER BY c.created_at ASC;
  `;
  const result = await query(sql, [post_id]);
  return result.rows;
};

// Get a single comment by ID
const getCommentById = async (comment_id) => {
  const sql = `
    SELECT * FROM comments
    WHERE id = $1;
  `;
  const result = await query(sql, [comment_id]);
  return result.rows[0];
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
};
