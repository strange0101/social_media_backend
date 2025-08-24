const express = require("express");
const {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
} = require("../utils/validation");
const { register, login, getProfile } = require("../controllers/auth");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", validateRequest(userRegistrationSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
router.post("/login", validateRequest(userLoginSchema), login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires JWT)
 */
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
