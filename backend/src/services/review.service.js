import Review from "../models/Review.js";
import Submission from "../models/Submission.js";
import JudgeAssignment from "../models/JudgeAssignment.js";

import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                           Create Review                                    */
/* -------------------------------------------------------------------------- */

export const createReviewService = async (
  judgeId,
  data
) => {
  const submission = await Submission.findById(data.submission);

  if (!submission || submission.isDeleted) {
    throw new ApiError(404, "Submission not found");
  }

  const assignment = await JudgeAssignment.findOne({
    hackathon: submission.hackathon,
    judge: judgeId,
    isDeleted: false,
  });

  if (!assignment) {
    throw new ApiError(
      403,
      "You are not assigned to this hackathon"
    );
  }

  const existing = await Review.findOne({
    submission: submission._id,
    judge: judgeId,
    isDeleted: false,
  });

  if (existing) {
    throw new ApiError(
      400,
      "You have already reviewed this submission"
    );
  }

  const review = await Review.create({
    submission: submission._id,
    hackathon: submission.hackathon,
    judge: judgeId,
    innovation: data.innovation,
    technicalImplementation: data.technicalImplementation,
    uiUx: data.uiUx,
    presentation: data.presentation,
    impact: data.impact,
    feedback: data.feedback,
  });

  return await Review.findById(review._id)
    .populate("judge", "name email")
    .populate("submission");
};

/* -------------------------------------------------------------------------- */
/*                           Update Review                                    */
/* -------------------------------------------------------------------------- */

export const updateReviewService = async (
  reviewId,
  judgeId,
  data
) => {
  const review = await Review.findById(reviewId);

  if (!review || review.isDeleted) {
    throw new ApiError(404, "Review not found");
  }

  if (review.judge.toString() !== judgeId.toString()) {
    throw new ApiError(
      403,
      "Only the assigned judge can update this review"
    );
  }

  review.innovation = data.innovation;
  review.technicalImplementation = data.technicalImplementation;
  review.uiUx = data.uiUx;
  review.presentation = data.presentation;
  review.impact = data.impact;
  review.feedback = data.feedback;

  await review.save();

  return review;
};

/* -------------------------------------------------------------------------- */
/*                           Get My Reviews                                   */
/* -------------------------------------------------------------------------- */

export const getMyReviewsService = async (judgeId) => {
  return await Review.find({
    judge: judgeId,
    isDeleted: false,
  })
    .populate("submission")
    .sort({ createdAt: -1 });
};

/* -------------------------------------------------------------------------- */
/*                   Get Reviews of a Submission                              */
/* -------------------------------------------------------------------------- */

export const getSubmissionReviewsService = async (
  submissionId
) => {
  return await Review.find({
    submission: submissionId,
    isDeleted: false,
  }).populate("judge", "name email");
};

/* -------------------------------------------------------------------------- */
/*                 Get Reviews of a Hackathon                                 */
/* -------------------------------------------------------------------------- */

export const getHackathonReviewsService = async (
  hackathonId
) => {
  return await Review.find({
    hackathon: hackathonId,
    isDeleted: false,
  })
    .populate("judge", "name email")
    .populate("submission");
};