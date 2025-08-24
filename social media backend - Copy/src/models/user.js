const { query } = require("../utils/database");
const bcrypt = require("bcryptjs");

/**
 * User model for database operations
 */

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async ({ username, email, password, full_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (username, email, password_hash, full_name, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING id, username, email, full_name, created_at`,
    [username, email, hashedPassword, full_name], // ✅ use hashedPassword
  );

  return result.rows[0];
};

/**
 * Find user by username
 */
const getUserByUsername = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0] || null;
};

/**
 * Find user by ID
 */
const getUserById = async (id) => {
  const result = await query(
    "SELECT id, username, email, full_name, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
};

/**
 * Verify user password
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const findUsersByName = async (searchTerm, limit = 10, offset = 0) => {
  const result = await query(
    `SELECT id, username, full_name 
     FROM users 
     WHERE username ILIKE $1 OR full_name ILIKE $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchTerm}%`, limit, offset]
  );
  return result.rows;
};

const getUserProfile = async (id) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.email, u.created_at,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count
     FROM users u
     WHERE u.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const updateUserProfile = async (id, { full_name, email }) => {
  const result = await query(
    `UPDATE users
     SET full_name = COALESCE($2, full_name),
         email = COALESCE($3, email),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, username, email, full_name, updated_at`,
    [id, full_name, email]
  );
  return result.rows[0];
};


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  findUsersByName,
  getUserProfile,
  updateUserProfile
};
