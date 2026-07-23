import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createSubmissionService,
  updateSubmissionService,
  getMySubmissionService,
  getHackathonSubmissionsService,
} from "../services/submission.service.js";

//Create Submission
export const createSubmission = asyncHandler(async (req, res) => {
  const submission = await createSubmissionService(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Project submitted successfully",
      submission
    )
  );
});

//Update Submission
export const updateSubmission = asyncHandler(async (req, res) => {
  const submission = await updateSubmissionService(
    req.params.id,
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Submission updated successfully",
      submission
    )
  );
});




//Get My Submission
export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await getMySubmissionService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Submission fetched successfully",
      submission
    )
  );
});


//Get Hackathon Submissions

export const getHackathonSubmissions = asyncHandler(async (req, res) => {
  const submissions = await getHackathonSubmissionsService(
    req.params.hackathonId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Submissions fetched successfully",
      submissions
    )
  );
});