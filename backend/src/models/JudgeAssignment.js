import mongoose from "mongoose";

const judgeAssignmentSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

judgeAssignmentSchema.index(
  {
    hackathon: 1,
    judge: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "JudgeAssignment",
  judgeAssignmentSchema
);