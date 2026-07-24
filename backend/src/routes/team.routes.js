import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  createTeam,
  joinTeam,
  leaveTeam,
  transferLeadership,
  deleteTeam,
  getMyTeam,
} from "../controllers/team.controller.js";

import {
  createTeamValidator,
  joinTeamValidator,
  transferLeadershipValidator,
  teamIdValidator,
  validate,
} from "../validators/team.validator.js";

const router = express.Router();

//Team Routes
// Create Team
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  createTeamValidator,
  validate,
  createTeam
);

// Join Team
router.post(
  "/join",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  joinTeamValidator,
  validate,
  joinTeam
);

// Get My Team
router.get(
  "/me",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  getMyTeam
);

// Leave Team
router.delete(
  "/:id/leave",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  teamIdValidator,
  validate,
  leaveTeam
);

// Transfer Leadership
router.patch(
  "/:id/transfer-leader",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  transferLeadershipValidator,
  validate,
  transferLeadership
);

// Delete Team
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT, ROLES.ADMIN),
  teamIdValidator,
  validate,
  deleteTeam
);

export default router;