const express = require("express");
const { validateRequest, createPostSchema } = require("../utils/validation");
const {
  create,
  getById,
  getUserPosts,
  getMyPosts,
  remove,
  getFeed,
  updatePost,
  searchPosts,
} = require("../controllers/posts");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

const router = express.Router();

/**
 * Posts routes
 */

// POST /api/posts - Create a new post
router.post("/", authenticateToken, validateRequest(createPostSchema), create);

// GET /api/posts/my - Get current user's posts
router.get("/my", authenticateToken, getMyPosts);

//  Static routes first
router.get("/feed", authenticateToken, getFeed);
router.get("/search", optionalAuth, searchPosts);
router.get("/user/:user_id", optionalAuth, getUserPosts);

// CRUD routes with :post_id at the end
router.put("/:post_id", authenticateToken, updatePost);
router.delete("/:post_id", authenticateToken, remove);
router.get("/:post_id", optionalAuth, getById);

module.exports = router;
