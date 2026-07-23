import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  registerTeam,
  cancelRegistration,
  getMyRegistration,
  getHackathonRegistrations,
  updateRegistrationStatus,
} from "../controllers/registration.controller.js";

import {
  createRegistrationValidator,
  updateRegistrationStatusValidator,
  validate,
} from "../validators/registration.validator.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                           Team Registration                                */
/* -------------------------------------------------------------------------- */

// Register Team
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  createRegistrationValidator,
  validate,
  registerTeam
);

// My Registration
router.get(
  "/me",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  getMyRegistration
);

// Cancel Registration
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  cancelRegistration
);

/* -------------------------------------------------------------------------- */
/*                           Organizer Routes                                 */
/* -------------------------------------------------------------------------- */

// All Registrations of a Hackathon
router.get(
  "/hackathon/:hackathonId",
  authMiddleware,
  authorizeRoles(ROLES.ORGANIZER, ROLES.ADMIN),
  getHackathonRegistrations
);

// Approve / Reject Registration
router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles(ROLES.ORGANIZER, ROLES.ADMIN),
  updateRegistrationStatusValidator,
  validate,
  updateRegistrationStatus
);

export default router;