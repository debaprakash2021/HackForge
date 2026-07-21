import Registration from "../models/Registration.js";
import Hackathon from "../models/Hackathon.js";
import ApiError from "../utils/ApiError.js";











// Register for a Hackathon
export const createRegistrationService = async (
  participantId,
  hackathonId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (hackathon.registrationStatus !== "Open") {
    throw new ApiError(400, "Registration is closed");
  }

  if (new Date() > hackathon.registrationDeadline) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  const existingRegistration = await Registration.findOne({
    participant: participantId,
    hackathon: hackathonId,
    isDeleted: false,
  });

  if (existingRegistration) {
    throw new ApiError(
      409,
      "You have already registered for this hackathon"
    );
  }

  const registration = await Registration.create({
    participant: participantId,
    hackathon: hackathonId,
  });

  hackathon.registrationCount += 1;
  await hackathon.save();

  return registration.populate([
    {
      path: "participant",
      select: "fullName email",
    },
    {
      path: "hackathon",
      select: "title theme startDate endDate",
    },
  ]);
};












// Cancel Registration
export const cancelRegistrationService = async (
  registrationId,
  participantId
) => {
  const registration = await Registration.findById(registrationId);

  if (!registration || registration.isDeleted) {
    throw new ApiError(404, "Registration not found");
  }

  if (registration.participant.toString() !== participantId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to cancel this registration"
    );
  }

  if (registration.status === "Approved") {
    throw new ApiError(
      400,
      "Approved registrations cannot be cancelled"
    );
  }

  registration.status = "Cancelled";
  registration.isDeleted = true;

  await registration.save();

  const hackathon = await Hackathon.findById(registration.hackathon);

  if (hackathon && hackathon.registrationCount > 0) {
    hackathon.registrationCount -= 1;
    await hackathon.save();
  }

  return registration;
};











// Get Logged-in Participant Registrations
export const getMyRegistrationsService = async (participantId) => {
  return await Registration.find({
    participant: participantId,
    isDeleted: false,
  })
    .populate("hackathon")
    .sort({ createdAt: -1 });
};












// Get Registrations for a Hackathon
export const getHackathonRegistrationsService = async (
  hackathonId,
  organizerId
) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon || hackathon.isDeleted) {
    throw new ApiError(404, "Hackathon not found");
  }

  if (hackathon.organizer.toString() !== organizerId.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to view registrations"
    );
  }

  return await Registration.find({
    hackathon: hackathonId,
    isDeleted: false,
  })
    .populate("participant", "fullName email avatar")
    .sort({ createdAt: -1 });
};











// Approve / Reject Registration
export const updateRegistrationStatusService = async (
  registrationId,
  organizerId,
  status,
  remarks
) => {
  const registration = await Registration.findById(registrationId)
    .populate("hackathon");

  if (!registration || registration.isDeleted) {
    throw new ApiError(404, "Registration not found");
  }

  if (
    registration.hackathon.organizer.toString() !== organizerId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update this registration"
    );
  }

  registration.status = status;
  registration.remarks = remarks || "";
  registration.approvedBy = organizerId;
  registration.approvedAt = new Date();

  await registration.save();

  return registration.populate([
    {
      path: "participant",
      select: "fullName email",
    },
    {
      path: "approvedBy",
      select: "fullName email",
    },
  ]);
};