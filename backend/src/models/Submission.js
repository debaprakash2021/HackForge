import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    projectTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    projectDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    githubRepo: {
      type: String,
      required: true,
      trim: true,
    },

    liveDemo: {
      type: String,
      trim: true,
      default: "",
    },

    videoDemo: {
      type: String,
      trim: true,
      default: "",
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    ppt: {
      type: String,
      default: "",
    },

    documentation: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Locked", "Reviewed"],
      default: "Draft",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    lastUpdatedAt: {
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

submissionSchema.pre("save", function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

submissionSchema.index({ team: 1 });
submissionSchema.index({ registration: 1 });
submissionSchema.index({ hackathon: 1 });
submissionSchema.index({ status: 1 });

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;