const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  addComment,
  editComment,
  removeComment,
  fetchPostComments,
} = require("../controllers/comments");

const router = express.Router();

/**
 * Comments routes
 */

// Create a new comment on a post
router.post("/", authenticateToken, addComment);

// Update an existing comment
router.put("/:commentId", authenticateToken, editComment);

// Delete a comment
router.delete("/:commentId", authenticateToken, removeComment);

// Get all comments for a post
router.get("/post/:postId", fetchPostComments);

module.exports = router;
