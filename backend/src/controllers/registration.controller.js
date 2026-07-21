import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createRegistrationService,
  cancelRegistrationService,
  getMyRegistrationsService,
  getHackathonRegistrationsService,
  updateRegistrationStatusService,
} from "../services/registration.service.js";










// Register for a Hackathon
export const registerForHackathon = asyncHandler(async (req, res) => {
  const registration = await createRegistrationService(
    req.user._id,
    req.body.hackathon
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Registration successful",
      registration
    )
  );
});










// Cancel Registration
export const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await cancelRegistrationService(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Registration cancelled successfully",
      registration
    )
  );
});










// Get My Registrations
export const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await getMyRegistrationsService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Registrations fetched successfully",
      registrations
    )
  );
});










// Get Registrations for a Hackathon
export const getHackathonRegistrations = asyncHandler(async (req, res) => {
  const registrations = await getHackathonRegistrationsService(
    req.params.hackathonId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Hackathon registrations fetched successfully",
      registrations
    )
  );
});










// Approve / Reject Registration
export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await updateRegistrationStatusService(
    req.params.id,
    req.user._id,
    req.body.status,
    req.body.remarks
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      `Registration ${req.body.status.toLowerCase()} successfully`,
      registration
    )
  );
});