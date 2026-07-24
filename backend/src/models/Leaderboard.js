import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
      index: true,
    },

    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    rank: {
      type: Number,
      default: null,
    },

    lastCalculatedAt: {
      type: Date,
      default: Date.now,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

leaderboardSchema.index(
  {
    hackathon: 1,
    submission: 1,
  },
  {
    unique: true,
  }
);

leaderboardSchema.index({
  hackathon: 1,
  rank: 1,
});

export default mongoose.model(
  "Leaderboard",
  leaderboardSchema
);