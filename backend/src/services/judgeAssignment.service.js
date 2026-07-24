import JudgeAssignment from "../models/JudgeAssignment.js";
import Hackathon from "../models/Hackathon.js";
import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

import { ROLES } from "../constants/roles.js";

/* -------------------------------------------------------------------------- */
/*                           Assign Judge                                     */
/* -------------------------------------------------------------------------- */

export const assignJudgeService = async (
  organizerId,
  organizerRole,
  data
) => {

  const hackathon = await Hackathon.findById(data.hackathon);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  // Only owner organizer or admin
  if (
    organizerRole !== ROLES.ADMIN &&
    hackathon.organizer.toString() !== organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to assign judges."
    );
  }

  const judge = await User.findById(data.judge);

  if (!judge || judge.isDeleted) {
    throw new ApiError(404, "Judge not found");
  }

  if (judge.role !== ROLES.JUDGE) {
    throw new ApiError(
      400,
      "Selected user is not a Judge."
    );
  }

  const existingAssignment =
    await JudgeAssignment.findOne({
      hackathon: data.hackathon,
      judge: data.judge,
      isDeleted: false,
    });

  if (existingAssignment) {
    throw new ApiError(
      400,
      "Judge is already assigned to this hackathon."
    );
  }

  const assignment =
    await JudgeAssignment.create({
      hackathon: data.hackathon,
      judge: data.judge,
      assignedBy: organizerId,
    });

  return await JudgeAssignment.findById(assignment._id)
    .populate("judge", "name email role")
    .populate("hackathon", "title");
};

/* -------------------------------------------------------------------------- */
/*                           Remove Judge                                     */
/* -------------------------------------------------------------------------- */

export const removeJudgeService = async (
  assignmentId,
  organizerId,
  organizerRole
) => {

  const assignment =
    await JudgeAssignment.findById(assignmentId)
      .populate("hackathon");

  if (!assignment || assignment.isDeleted) {
    throw new ApiError(
      404,
      "Assignment not found."
    );
  }

  if (
    organizerRole !== ROLES.ADMIN &&
    assignment.hackathon.organizer.toString() !==
      organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized."
    );
  }

  assignment.isDeleted = true;

  await assignment.save();

  return assignment;
};

/* -------------------------------------------------------------------------- */
/*                     Get Judges of Hackathon                                */
/* -------------------------------------------------------------------------- */

export const getHackathonJudgesService = async (
  hackathonId
) => {

  return await JudgeAssignment.find({
    hackathon: hackathonId,
    isDeleted: false,
  })
    .populate(
      "judge",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });
};

/* -------------------------------------------------------------------------- */
/*                     Get Assigned Hackathons                                */
/* -------------------------------------------------------------------------- */

export const getMyAssignedHackathonsService = async (
  judgeId
) => {

  return await JudgeAssignment.find({
    judge: judgeId,
    isDeleted: false,
  })
    .populate({
      path: "hackathon",
      select:
        "title description theme startDate endDate venue mode",
    })
    .sort({
      createdAt: -1,
    });
};