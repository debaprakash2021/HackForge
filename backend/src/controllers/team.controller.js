import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createTeamService,
  joinTeamService,
  leaveTeamService,
  transferLeadershipService,
  deleteTeamService,
  getMyTeamService,
} from "../services/team.service.js";




// Create Team
export const createTeam = asyncHandler(async (req, res) => {
  const { teamName, description, hackathon } = req.body;

  const team = await createTeamService(
    req.user._id,
    teamName,
    description,
    hackathon
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Team created successfully", team));
});



//Join Team
export const joinTeam = asyncHandler(async (req, res) => {
  const { teamCode } = req.body;

  const team = await joinTeamService(req.user._id, teamCode);

  return res
    .status(200)
    .json(new ApiResponse(200, "Joined team successfully", team));
});



//Leave Team
export const leaveTeam = asyncHandler(async (req, res) => {
  const team = await leaveTeamService(req.params.id, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Left team successfully", team));
});




//Transfer Leadership
export const transferLeadership = asyncHandler(async (req, res) => {
  const { newLeader } = req.body;

  const team = await transferLeadershipService(
    req.params.id,
    req.user._id,
    newLeader
  );

  return res.status(200).json(
    new ApiResponse(200, "Leadership transferred successfully", team)
  );
});





//Delete Team
export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await deleteTeamService(req.params.id, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Team deleted successfully", team));
});




//Get My Team
export const getMyTeam = asyncHandler(async (req, res) => {
  const team = await getMyTeamService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Team fetched successfully", team));
});