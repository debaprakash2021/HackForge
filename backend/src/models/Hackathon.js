import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Hackathon title is required"],
      trim: true,
      minlength: 5,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },

    theme: {
      type: String,
      required: [true, "Theme is required"],
      trim: true,
    },

    mode: {
      type: String,
      required: true,
      enum: ["Online", "Offline", "Hybrid"],
    },

    venue: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    banner: {
      type: String,
      default: "",
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    maxTeamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    rules: [
      {
        type: String,
        trim: true,
      },
    ],

    judgingCriteria: [
      {
        type: String,
        trim: true,
      },
    ],

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    registrationStatus: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },

    registrationCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
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

// Useful indexes
hackathonSchema.index({ title: "text", description: "text", theme: "text" });
hackathonSchema.index({ organizer: 1 });
hackathonSchema.index({ status: 1 });
hackathonSchema.index({ registrationStatus: 1 });
hackathonSchema.index({ startDate: 1 });
hackathonSchema.index({ endDate: 1 });

const Hackathon = mongoose.model("Hackathon", hackathonSchema);

export default Hackathon;