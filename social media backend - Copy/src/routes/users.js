const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
} = require("../controllers/users");

const router = express.Router();

// Follow a user
router.post("/follow", authenticateToken, follow);

// Unfollow a user
router.delete("/unfollow", authenticateToken, unfollow);

// Get users the current user is following
router.get("/following", authenticateToken, getMyFollowing);

// Get users that follow the current user
router.get("/followers", authenticateToken, getMyFollowers);

// Get follow stats (followers/following counts)
router.get("/stats", authenticateToken, getFollowStats);

module.exports = router;
