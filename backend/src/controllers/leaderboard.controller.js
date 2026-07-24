import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  generateLeaderboardService,
  publishLeaderboardService,
  getLeaderboardService,
} from "../services/leaderboard.service.js";

/* -------------------------------------------------------------------------- */
/*                      Generate Leaderboard                                  */
/* -------------------------------------------------------------------------- */

export const generateLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await generateLeaderboardService(
    req.params.hackathonId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Leaderboard generated successfully.",
      leaderboard
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                      Publish Leaderboard                                   */
/* -------------------------------------------------------------------------- */

export const publishLeaderboard = asyncHandler(async (req, res) => {
  await publishLeaderboardService(req.params.hackathonId);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Leaderboard published successfully."
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                        Public Leaderboard                                  */
/* -------------------------------------------------------------------------- */

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await getLeaderboardService(
    req.params.hackathonId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Leaderboard fetched successfully.",
      leaderboard
    )
  );
});