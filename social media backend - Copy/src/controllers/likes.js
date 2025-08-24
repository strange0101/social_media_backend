const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
} = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const like = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Check if user already liked the post
    const alreadyLiked = await hasUserLikedPost({ user_id: userId, post_id: postId });
    if (alreadyLiked) {
      return res.status(400).json({ error: "Post already liked" });
    }

    await likePost({ user_id: userId, post_id: postId });
    logger.verbose(`User ${userId} liked post ${postId}`);

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    logger.critical("Error in like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await unlikePost({ user_id: userId, post_id: postId });
    logger.verbose(`User ${userId} unliked post ${postId}`);

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Error in unlike:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all likes for a post
 */
const getLikesForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const likes = await getPostLikes(postId);
    res.status(200).json({ likes });
  } catch (error) {
    logger.critical("Error in getLikesForPost:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all posts liked by the current user
 */
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await getUserLikes(userId);
    res.status(200).json({ posts });
  } catch (error) {
    logger.critical("Error in getLikedPosts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  like,
  unlike,
  getLikesForPost,
  getLikedPosts,
};
