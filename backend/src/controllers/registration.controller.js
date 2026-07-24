import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createRegistrationService,
  cancelRegistrationService,
  getMyRegistrationService,
  getHackathonRegistrationsService,
  updateRegistrationStatusService,
} from "../services/registration.service.js";



//Register Team for Hackathon
export const registerTeam = asyncHandler(async (req, res) => {
  const { team, hackathon } = req.body;

  const registration = await createRegistrationService(
    req.user._id,
    team,
    hackathon
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Team registered successfully",
      registration
    )
  );
});



//Cancel Registration
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




//Get My Registration
export const getMyRegistration = asyncHandler(async (req, res) => {
  const registration = await getMyRegistrationService(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Registration fetched successfully",
      registration
    )
  );
});




//Get Registrations of a Hackathon
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





//Approve / Reject Registration 
export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const registration = await updateRegistrationStatusService(
    req.params.id,
    req.user._id,
    status,
    remarks
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Registration updated successfully",
      registration
    )
  );
});