import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createReviewService,
  updateReviewService,
  getMyReviewsService,
  getSubmissionReviewsService,
  getHackathonReviewsService,
} from "../services/review.service.js";

/* -------------------------------------------------------------------------- */
/*                            Create Review                                   */
/* -------------------------------------------------------------------------- */

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Review submitted successfully",
      review
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                            Update Review                                   */
/* -------------------------------------------------------------------------- */

export const updateReview = asyncHandler(async (req, res) => {
  const review = await updateReviewService(
    req.params.id,
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Review updated successfully",
      review
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                            Get My Reviews                                  */
/* -------------------------------------------------------------------------- */

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await getMyReviewsService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Reviews fetched successfully",
      reviews
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                     Get Submission Reviews                                 */
/* -------------------------------------------------------------------------- */

export const getSubmissionReviews = asyncHandler(async (req, res) => {
  const reviews = await getSubmissionReviewsService(
    req.params.submissionId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Submission reviews fetched successfully",
      reviews
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                      Get Hackathon Reviews                                 */
/* -------------------------------------------------------------------------- */

export const getHackathonReviews = asyncHandler(async (req, res) => {
  const reviews = await getHackathonReviewsService(
    req.params.hackathonId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Hackathon reviews fetched successfully",
      reviews
    )
  );
});