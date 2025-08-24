const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
} = require("../models/follow.js");

const { verbose, critical } = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId } = req.body; // pass userId in body

    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (followerId === userId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    await followUser({ follower_id: followerId, following_id: userId });
    verbose(`User ${followerId} followed ${userId}`);

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    critical("Error in follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId } = req.body; // pass userId in body

    if (!userId) return res.status(400).json({ error: "userId is required" });

    await unfollowUser({ follower_id: followerId, following_id: userId });
    verbose(`User ${followerId} unfollowed ${userId}`);

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    critical("Error in unfollow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users the current user is following
 */
const getMyFollowing = async (req, res) => {
  try {
    const following = await getFollowing(req.user.id);
    res.status(200).json({ following });
  } catch (error) {
    critical("Error in getMyFollowing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get users that follow the current user
 */
const getMyFollowers = async (req, res) => {
  try {
    const followers = await getFollowers(req.user.id);
    res.status(200).json({ followers });
  } catch (error) {
    critical("Error in getMyFollowers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get follow stats (followers/following count) for current user
 */
const getFollowStats = async (req, res) => {
  try {
    const counts = await getFollowCounts(req.user.id);
    res.status(200).json(counts);
  } catch (error) {
    critical("Error in getFollowStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  follow,
  unfollow,
  getMyFollowing,
  getMyFollowers,
  getFollowStats,
};
