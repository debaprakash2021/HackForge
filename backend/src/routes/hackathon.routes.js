import express from "express";

import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
} from "../controllers/hackathon.controller.js";

import {
  createHackathonValidator,
  updateHackathonValidator,
  validate,
} from "../validators/hackathon.validator.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get all hackathons
router.get("/", getAllHackathons);

// Get single hackathon
router.get("/:id", getHackathonById);

/*
|--------------------------------------------------------------------------
| Protected Routes (Admin & Organizer)
|--------------------------------------------------------------------------
*/

// Create hackathon
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  createHackathonValidator,
  validate,
  createHackathon
);

// Update hackathon
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  updateHackathonValidator,
  validate,
  updateHackathon
);

// Delete hackathon
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  deleteHackathon
);

export default router;