import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },

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

    innovation: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },

    technicalImplementation: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },

    uiUx: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },

    presentation: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },

    impact: {
      type: Number,
      required: true,
      min: 0,
      max: 20,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: Date.now,
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

reviewSchema.pre("save", function (next) {
  this.totalScore =
    this.innovation +
    this.technicalImplementation +
    this.uiUx +
    this.presentation +
    this.impact;

  next();
});

reviewSchema.index(
  {
    submission: 1,
    judge: 1,
  },
  {
    unique: true,
  }
);

reviewSchema.index({ hackathon: 1 });
reviewSchema.index({ judge: 1 });

export default mongoose.model("Review", reviewSchema);