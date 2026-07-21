import express from "express";

import {
  registerForHackathon,
  cancelRegistration,
  getMyRegistrations,
  getHackathonRegistrations,
  updateRegistrationStatus,
} from "../controllers/registration.controller.js";

import {
  createRegistrationValidator,
  updateRegistrationStatusValidator,
  validate,
} from "../validators/registration.validator.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Participant Routes
|--------------------------------------------------------------------------
*/

// Register for a hackathon
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  createRegistrationValidator,
  validate,
  registerForHackathon
);

// My registrations
router.get(
  "/me",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  getMyRegistrations
);

// Cancel registration
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.PARTICIPANT),
  cancelRegistration
);

/*
|--------------------------------------------------------------------------
| Organizer Routes
|--------------------------------------------------------------------------
*/

// View registrations of a hackathon
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