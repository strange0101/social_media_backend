const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  like,
  unlike,
  getLikesForPost,
  getLikedPosts,
} = require("../controllers/likes");

const router = express.Router();

/**
 * Likes routes
 */

// Like a post
router.post("/:postId", authenticateToken, like);

// Unlike a post
router.delete("/:postId", authenticateToken, unlike);

// Get all likes for a post
router.get("/post/:postId", authenticateToken, getLikesForPost);

// Get all posts liked by the current user
router.get("/user", authenticateToken, getLikedPosts);

module.exports = router;
