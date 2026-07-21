import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createHackathonService,
  getAllHackathonsService,
  getHackathonByIdService,
  updateHackathonService,
  deleteHackathonService,
  searchHackathonsService,
  filterHackathonsService,
} from "../services/hackathon.service.js";

// Create Hackathon
export const createHackathon = asyncHandler(async (req, res) => {
  const hackathon = await createHackathonService(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, "Hackathon created successfully", hackathon));
});

// Get All Hackathons
export const getAllHackathons = asyncHandler(async (req, res) => {
  const hackathons = await getAllHackathonsService();

  return res
    .status(200)
    .json(new ApiResponse(200, "Hackathons fetched successfully", hackathons));
});

// Get Single Hackathon
export const getHackathonById = asyncHandler(async (req, res) => {
  const hackathon = await getHackathonByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Hackathon fetched successfully", hackathon));
});

// Update Hackathon
export const updateHackathon = asyncHandler(async (req, res) => {
  const hackathon = await updateHackathonService(
    req.params.id,
    req.user._id,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Hackathon updated successfully", hackathon));
});

// Delete Hackathon
export const deleteHackathon = asyncHandler(async (req, res) => {
  await deleteHackathonService(req.params.id, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Hackathon deleted successfully"));
});

// Search Hackathons
export const searchHackathons = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  const hackathons = await searchHackathonsService(keyword);

  return res
    .status(200)
    .json(new ApiResponse(200, "Search completed successfully", hackathons));
});

// Filter Hackathons
export const filterHackathons = asyncHandler(async (req, res) => {
  const hackathons = await filterHackathonsService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, "Filtered hackathons fetched successfully", hackathons));
});