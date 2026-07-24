import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  createReview,
  updateReview,
  getMyReviews,
  getSubmissionReviews,
  getHackathonReviews,
} from "../controllers/review.controller.js";

import {
  createReviewValidator,
  updateReviewValidator,
  validate,
} from "../validators/review.validator.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                              Judge Routes                                  */
/* -------------------------------------------------------------------------- */

// Create Review
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.JUDGE),
  createReviewValidator,
  validate,
  createReview
);

// Update Review
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.JUDGE),
  updateReviewValidator,
  validate,
  updateReview
);

// My Reviews
router.get(
  "/my",
  authMiddleware,
  authorizeRoles(ROLES.JUDGE),
  getMyReviews
);

/* -------------------------------------------------------------------------- */
/*                        Organizer/Admin Routes                              */
/* -------------------------------------------------------------------------- */

// Reviews of a Submission
router.get(
  "/submission/:submissionId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  getSubmissionReviews
);

// Reviews of a Hackathon
router.get(
  "/hackathon/:hackathonId",
  authMiddleware,
  authorizeRoles(
    ROLES.ORGANIZER,
    ROLES.ADMIN
  ),
  getHackathonReviews
);

export default router;