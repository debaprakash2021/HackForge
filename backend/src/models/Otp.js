import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: [
        "EMAIL_VERIFICATION",
        "PASSWORD_RESET",
      ],
      required: true,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: {
        expires: 0, // MongoDB TTL Index
      },
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({
  email: 1,
  purpose: 1,
});

export default mongoose.model("Otp", otpSchema);