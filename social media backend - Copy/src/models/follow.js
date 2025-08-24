const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 */

// Follow a user
const followUser = async ({ follower_id, following_id }) => {
  const sql = `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await query(sql, [follower_id, following_id]);
  return result.rows[0];
};

// Unfollow a user
const unfollowUser = async ({ follower_id, following_id }) => {
  const sql = `
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2
    RETURNING *;
  `;
  const result = await query(sql, [follower_id, following_id]);
  return result.rows[0];
};

// Get list of users that a given user is following
const getFollowing = async (userId) => {
  const sql = `
    SELECT u.id, u.username, u.full_name
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

// Get list of followers for a given user
const getFollowers = async (userId) => {
  const sql = `
    SELECT u.id, u.username, u.full_name
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

// Get counts of followers and following
const getFollowCounts = async (userId) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following_count;
  `;
  const result = await query(sql, [userId]);
  return result.rows[0];
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
};
