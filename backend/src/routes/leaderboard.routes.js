import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  generateLeaderboard,
  publishLeaderboard,
  getLeaderboard,
} from "../controllers/leaderboard.controller.js";

import {
  leaderboardValidator,
  validate,
} from "../validators/leaderboard.validator.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                         Public Route                                       */
/* -------------------------------------------------------------------------- */

router.get(
  "/:hackathonId",
  leaderboardValidator,
  validate,
  getLeaderboard
);

/* -------------------------------------------------------------------------- */
/*                     Organizer / Admin Routes                               */
/* -------------------------------------------------------------------------- */

router.post(
  "/generate/:hackathonId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  leaderboardValidator,
  validate,
  generateLeaderboard
);

router.patch(
  "/publish/:hackathonId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  leaderboardValidator,
  validate,
  publishLeaderboard
);

export default router;