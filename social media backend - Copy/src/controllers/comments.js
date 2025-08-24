const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
  getCommentById,
} = require("../models/comment");
const logger = require("../utils/logger");

/**
 * Create a new comment
 */
const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, content } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: "Post ID and content are required" });
    }

    const comment = await createComment({
      user_id: userId,
      post_id: postId,
      text: content,
    });

    logger.verbose(`User ${userId} added comment ${comment.id} on post ${postId}`);
    res.status(201).json(comment);
  } catch (error) {
    logger.critical("Error in addComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a user's comment
 */
const editComment = async (req, res) => {
  try {
    const userId = req.user.id;
	 const commentId = req.params.commentId; 
    const {  content } = req.body;

    if (!content || !commentId) {
      return res.status(400).json({ error: "Comment ID and new content are required" });
    }

    const comment = await updateComment({ comment_id: commentId, user_id: userId, text: content });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found or not authorized" });
    }

    logger.verbose(`User ${userId} updated comment ${commentId}`);
    res.status(200).json(comment);
  } catch (error) {
    logger.critical("Error in editComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a user's comment
 */
const removeComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    const deleted = await deleteComment({ comment_id: commentId, user_id: userId });

    if (!deleted) {
      return res.status(404).json({ error: "Comment not found or not authorized" });
    }

    logger.verbose(`User ${userId} deleted comment ${commentId}`);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.critical("Error in removeComment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all comments for a post with optional pagination
 */
const fetchPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let comments = await getPostComments(postId);

    // Apply pagination
    comments = comments.slice(offset, offset + limit);

    res.status(200).json({ comments, count: comments.length });
  } catch (error) {
    logger.critical("Error in fetchPostComments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addComment,
  editComment,
  removeComment,
  fetchPostComments,
};
