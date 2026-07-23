import Registration from "../models/Registration.js";
import Team from "../models/Team.js";
import Hackathon from "../models/Hackathon.js";

import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                       Register Team for Hackathon                          */
/* -------------------------------------------------------------------------- */

export const createRegistrationService = async (
  leaderId,
  teamId,
  hackathonId
) => {
  // Check Hackathon
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  // Check Team
  const team = await Team.findById(teamId);

  if (!team || team.isDeleted) {
    throw new ApiError(404, "Team not found");
  }

  // Only leader can register
  if (team.leader.toString() !== leaderId.toString()) {
    throw new ApiError(
      403,
      "Only the team leader can register the team"
    );
  }

  // Team must belong to this hackathon
  if (team.hackathon.toString() !== hackathonId.toString()) {
    throw new ApiError(
      400,
      "Team does not belong to this hackathon"
    );
  }

  // Registration open?
  if (hackathon.registrationStatus !== "Open") {
    throw new ApiError(
      400,
      "Registration is closed"
    );
  }

  // Deadline check
  if (new Date() > hackathon.registrationDeadline) {
    throw new ApiError(
      400,
      "Registration deadline has passed"
    );
  }

  // Already registered?
  const existingRegistration = await Registration.findOne({
    team: teamId,
    hackathon: hackathonId,
    isDeleted: false,
  });

  if (existingRegistration) {
    throw new ApiError(
      400,
      "Team has already registered"
    );
  }

  const registration = await Registration.create({
    team: teamId,
    hackathon: hackathonId,
  });

  hackathon.registrationCount += 1;
  await hackathon.save();

  return await Registration.findById(registration._id)
    .populate("team")
    .populate("hackathon");
};

/* -------------------------------------------------------------------------- */
/*                         Cancel Registration                                */
/* -------------------------------------------------------------------------- */

export const cancelRegistrationService = async (
  registrationId,
  leaderId
) => {
  const registration = await Registration.findById(registrationId)
    .populate("team");

  if (!registration || registration.isDeleted) {
    throw new ApiError(404, "Registration not found");
  }

  if (
    registration.team.leader.toString() !==
    leaderId.toString()
  ) {
    throw new ApiError(
      403,
      "Only the team leader can cancel registration"
    );
  }

  if (registration.status === "Approved") {
    throw new ApiError(
      400,
      "Approved registration cannot be cancelled"
    );
  }

  registration.status = "Cancelled";
  registration.isDeleted = true;

  await registration.save();

  const hackathon = await Hackathon.findById(
    registration.hackathon
  );

  if (hackathon.registrationCount > 0) {
    hackathon.registrationCount -= 1;
    await hackathon.save();
  }

  return registration;
};

/* -------------------------------------------------------------------------- */
/*                         Get My Team Registration                           */
/* -------------------------------------------------------------------------- */

export const getMyRegistrationService = async (
  leaderId
) => {
  const team = await Team.findOne({
    leader: leaderId,
    isDeleted: false,
  });

  if (!team) {
    throw new ApiError(
      404,
      "You don't lead any team"
    );
  }

  const registration = await Registration.findOne({
    team: team._id,
    isDeleted: false,
  })
    .populate("team")
    .populate("hackathon")
    .populate("approvedBy", "name email");

  if (!registration) {
    throw new ApiError(
      404,
      "Registration not found"
    );
  }

  return registration;
};

/* -------------------------------------------------------------------------- */
/*                  Get Registrations of a Hackathon                          */
/* -------------------------------------------------------------------------- */

export const getHackathonRegistrationsService = async (
  hackathonId,
  organizerId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (
    hackathon.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  return await Registration.find({
    hackathon: hackathonId,
    isDeleted: false,
  })
    .populate({
      path: "team",
      populate: {
        path: "leader members.user",
        select: "name email",
      },
    })
    .populate("approvedBy", "name email");
};

/* -------------------------------------------------------------------------- */
/*                     Approve / Reject Registration                          */
/* -------------------------------------------------------------------------- */

export const updateRegistrationStatusService = async (
  registrationId,
  organizerId,
  status,
  remarks
) => {
  const registration = await Registration.findById(registrationId);

  if (!registration || registration.isDeleted) {
    throw new ApiError(
      404,
      "Registration not found"
    );
  }

  const hackathon = await Hackathon.findById(
    registration.hackathon
  );

  if (
    hackathon.organizer.toString() !==
    organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  registration.status = status;
  registration.remarks = remarks || "";
  registration.approvedBy = organizerId;
  registration.approvedAt = new Date();

  await registration.save();

  return await Registration.findById(registration._id)
    .populate({
      path: "team",
      populate: {
        path: "leader members.user",
        select: "name email",
      },
    })
    .populate("approvedBy", "name email");
};