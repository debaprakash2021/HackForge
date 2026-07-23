import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  createSubmission,
  updateSubmission,
  getMySubmission,
  getHackathonSubmissions,
} from "../controllers/submission.controller.js";

import {
  createSubmissionValidator,
  updateSubmissionValidator,
  validate,
} from "../validators/submission.validator.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           Participant Routes                               */
/* -------------------------------------------------------------------------- */

// Submit Project
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  createSubmissionValidator,
  validate,
  createSubmission
);

// Update Submission
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  updateSubmissionValidator,
  validate,
  updateSubmission
);

// My Submission
router.get(
  "/me",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  getMySubmission
);

/* -------------------------------------------------------------------------- */
/*                           Organizer Routes                                 */
/* -------------------------------------------------------------------------- */

// View all submissions of a hackathon
router.get(
  "/hackathon/:hackathonId",
  authMiddleware,
  authorizeRoles(ROLES.ORGANIZER, ROLES.ADMIN),
  getHackathonSubmissions
);

export default router;