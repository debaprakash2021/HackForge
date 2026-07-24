import Leaderboard from "../models/Leaderboard.js";
import Review from "../models/Review.js";
import Submission from "../models/Submission.js";
import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                     Generate Leaderboard                                   */
/* -------------------------------------------------------------------------- */

export const generateLeaderboardService = async (
  hackathonId
) => {

  const submissions = await Submission.find({
    hackathon: hackathonId,
    isDeleted: false,
  });

  if (!submissions.length) {
    throw new ApiError(
      404,
      "No submissions found."
    );
  }

  await Leaderboard.deleteMany({
    hackathon: hackathonId,
  });

  const leaderboard = [];

  for (const submission of submissions) {

    const reviews = await Review.find({
      submission: submission._id,
      isDeleted: false,
    });

    const totalReviews = reviews.length;

    let averageScore = 0;

    if (totalReviews > 0) {

      const totalScore = reviews.reduce(
        (sum, review) => sum + review.totalScore,
        0
      );

      averageScore = Number(
        (totalScore / totalReviews).toFixed(2)
      );
    }

    leaderboard.push({
      hackathon: hackathonId,
      submission: submission._id,
      team: submission.team,
      averageScore,
      totalReviews,
      lastCalculatedAt: new Date(),
    });
  }

  leaderboard.sort(
    (a, b) => b.averageScore - a.averageScore
  );

  let currentRank = 1;

  for (let i = 0; i < leaderboard.length; i++) {

    if (
      i > 0 &&
      leaderboard[i].averageScore <
        leaderboard[i - 1].averageScore
    ) {
      currentRank = i + 1;
    }

    leaderboard[i].rank = currentRank;
  }

  await Leaderboard.insertMany(leaderboard);

  return await Leaderboard.find({
    hackathon: hackathonId,
  })
    .populate("team")
    .populate("submission")
    .sort({ rank: 1 });
};

/* -------------------------------------------------------------------------- */
/*                     Publish Leaderboard                                    */
/* -------------------------------------------------------------------------- */

export const publishLeaderboardService = async (
  hackathonId
) => {

  const leaderboard = await Leaderboard.find({
    hackathon: hackathonId,
  });

  if (!leaderboard.length) {
    throw new ApiError(
      404,
      "Leaderboard not generated."
    );
  }

  await Leaderboard.updateMany(
    {
      hackathon: hackathonId,
    },
    {
      isPublished: true,
    }
  );

  return true;
};

/* -------------------------------------------------------------------------- */
/*                     Public Leaderboard                                     */
/* -------------------------------------------------------------------------- */

export const getLeaderboardService = async (
  hackathonId
) => {

  return await Leaderboard.find({
    hackathon: hackathonId,
    isPublished: true,
    isDeleted: false,
  })
    .populate({
      path: "team",
      populate: {
        path: "leader",
        select: "name email",
      },
    })
    .populate("submission")
    .sort({
      rank: 1,
    });
};