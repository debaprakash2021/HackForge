import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import {
  registerValidator,
  loginValidator,
  validate,
} from "../validators/auth.validator.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  validate,
  registerUser
);

// Login
router.post(
  "/login",
  loginValidator,
  validate,
  loginUser
);

// Logout
router.post(
  "/logout",
  logoutUser
);

// Current User
router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

export default router;