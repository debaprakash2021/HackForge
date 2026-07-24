import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  assignJudgeService,
  removeJudgeService,
  getHackathonJudgesService,
  getMyAssignedHackathonsService,
} from "../services/judgeAssignment.service.js";

/* -------------------------------------------------------------------------- */
/*                           Assign Judge                                     */
/* -------------------------------------------------------------------------- */

export const assignJudge = asyncHandler(async (req, res) => {
  const assignment = await assignJudgeService(
    req.user._id,
    req.user.role,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Judge assigned successfully.",
      assignment
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                           Remove Judge                                     */
/* -------------------------------------------------------------------------- */

export const removeJudge = asyncHandler(async (req, res) => {
  const assignment = await removeJudgeService(
    req.params.assignmentId,
    req.user._id,
    req.user.role
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Judge removed successfully.",
      assignment
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                     Get Judges of Hackathon                                */
/* -------------------------------------------------------------------------- */

export const getHackathonJudges = asyncHandler(async (req, res) => {
  const judges = await getHackathonJudgesService(
    req.params.hackathonId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Judges fetched successfully.",
      judges
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                  Get My Assigned Hackathons                                */
/* -------------------------------------------------------------------------- */

export const getMyAssignedHackathons = asyncHandler(async (req, res) => {
  const hackathons = await getMyAssignedHackathonsService(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Assigned hackathons fetched successfully.",
      hackathons
    )
  );
});