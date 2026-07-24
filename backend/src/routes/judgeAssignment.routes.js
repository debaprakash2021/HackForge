import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  assignJudge,
  removeJudge,
  getHackathonJudges,
  getMyAssignedHackathons,
} from "../controllers/judgeAssignment.controller.js";

import {
  assignJudgeValidator,
  assignmentIdValidator,
  hackathonIdValidator,
  validate,
} from "../validators/judgeAssignment.validator.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                     Organizer / Admin Routes                               */
/* -------------------------------------------------------------------------- */

// Assign Judge
router.post(
  "/",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  assignJudgeValidator,
  validate,
  assignJudge
);

// Remove Judge
router.delete(
  "/:assignmentId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  assignmentIdValidator,
  validate,
  removeJudge
);

// Get Judges of a Hackathon
router.get(
  "/hackathon/:hackathonId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  hackathonIdValidator,
  validate,
  getHackathonJudges
);

/* -------------------------------------------------------------------------- */
/*                            Judge Routes                                    */
/* -------------------------------------------------------------------------- */

// My Assigned Hackathons
router.get(
  "/my",
  authMiddleware,
  authorizeRoles(
    ROLES.JUDGE
  ),
  getMyAssignedHackathons
);

export default router;