import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
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

// A participant can register only once for a hackathon
registrationSchema.index(
  {
    participant: 1,
    hackathon: 1,
  },
  {
    unique: true,
  }
);

// Useful indexes
registrationSchema.index({ participant: 1 });
registrationSchema.index({ hackathon: 1 });
registrationSchema.index({ status: 1 });

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

export default Registration;