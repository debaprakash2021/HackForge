import Team from "../models/Team.js";
import User from "../models/User.js";
import Hackathon from "../models/Hackathon.js";

import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                             Utility Functions                              */
/* -------------------------------------------------------------------------- */

const generateTeamCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "HF-";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const generateUniqueTeamCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateTeamCode();
    exists = await Team.findOne({ teamCode: code });
  }

  return code;
};

/* -------------------------------------------------------------------------- */
/*                             Create Team                                    */
/* -------------------------------------------------------------------------- */

export const createTeamService = async (
  leaderId,
  teamName,
  description,
  hackathonId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  const existingTeam = await Team.findOne({
    hackathon: hackathonId,
    isDeleted: false,
    $or: [
      { leader: leaderId },
      { "members.user": leaderId }
    ]
  });

  if (existingTeam) {
    throw new ApiError(
      400,
      "You are already part of a team in this hackathon"
    );
  }

  const teamCode = await generateUniqueTeamCode();

  const team = await Team.create({
    teamName,
    description,
    teamCode,
    hackathon: hackathonId,
    leader: leaderId,
    members: [
      {
        user: leaderId,
        role: "Leader",
      },
    ],
  });

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .populate("hackathon", "title");
};

/* -------------------------------------------------------------------------- */
/*                               Join Team                                    */
/* -------------------------------------------------------------------------- */

export const joinTeamService = async (
  userId,
  teamCode
) => {
  const team = await Team.findOne({
    teamCode,
    isDeleted: false,
  }).populate("hackathon");

  if (!team) {
    throw new ApiError(404, "Invalid Team Code");
  }

  const alreadyJoined = await Team.findOne({
    hackathon: team.hackathon._id,
    isDeleted: false,
    $or: [
      { leader: userId },
      { "members.user": userId },
    ],
  });

  if (alreadyJoined) {
    throw new ApiError(
      400,
      "You already belong to a team in this hackathon"
    );
  }

  if (
    team.members.length >= team.hackathon.maxTeamSize
  ) {
    throw new ApiError(
      400,
      "Team is already full"
    );
  }

  team.members.push({
    user: userId,
    role: "Member",
  });

  await team.save();

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .populate("hackathon", "title");
};

/* -------------------------------------------------------------------------- */
/*                              Leave Team                                    */
/* -------------------------------------------------------------------------- */

export const leaveTeamService = async (
  teamId,
  userId
) => {
  const team = await Team.findById(teamId);

  if (!team || team.isDeleted) {
    throw new ApiError(404, "Team not found");
  }

  if (
    team.leader.toString() === userId.toString()
  ) {
    throw new ApiError(
      400,
      "Leader cannot leave without transferring leadership"
    );
  }

  team.members = team.members.filter(
    member =>
      member.user.toString() !== userId.toString()
  );

  await team.save();

  return team;
};

/* -------------------------------------------------------------------------- */
/*                         Transfer Leadership                                */
/* -------------------------------------------------------------------------- */

export const transferLeadershipService = async (
  teamId,
  currentLeader,
  newLeader
) => {
  const team = await Team.findById(teamId);

  if (!team || team.isDeleted) {
    throw new ApiError(404, "Team not found");
  }

  if (
    team.leader.toString() !== currentLeader.toString()
  ) {
    throw new ApiError(
      403,
      "Only current leader can transfer leadership"
    );
  }

  const member = team.members.find(
    m => m.user.toString() === newLeader.toString()
  );

  if (!member) {
    throw new ApiError(
      404,
      "New leader must be a team member"
    );
  }

  team.members.forEach(member => {
    member.role = "Member";
  });

  member.role = "Leader";

  team.leader = newLeader;

  await team.save();

  return await Team.findById(team._id)
    .populate("leader", "name email")
    .populate("members.user", "name email");
};

/* -------------------------------------------------------------------------- */
/*                           Delete Team                                      */
/* -------------------------------------------------------------------------- */

export const deleteTeamService = async (
  teamId,
  userId
) => {
  const team = await Team.findById(teamId);

  if (!team || team.isDeleted) {
    throw new ApiError(404, "Team not found");
  }

  if (
    team.leader.toString() !== userId.toString()
  ) {
    throw new ApiError(
      403,
      "Only leader can delete the team"
    );
  }

  team.status = "Disbanded";
  team.isDeleted = true;

  await team.save();

  return team;
};

/* -------------------------------------------------------------------------- */
/*                           Get My Team                                      */
/* -------------------------------------------------------------------------- */

export const getMyTeamService = async (
  userId
) => {
  const team = await Team.findOne({
    isDeleted: false,
    $or: [
      { leader: userId },
      { "members.user": userId },
    ],
  })
    .populate("leader", "name email")
    .populate("members.user", "name email")
    .populate("hackathon", "title");

  if (!team) {
    throw new ApiError(
      404,
      "You are not part of any team"
    );
  }

  return team;
};