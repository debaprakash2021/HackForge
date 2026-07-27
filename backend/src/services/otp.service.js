import crypto from "crypto";

import Otp from "../models/Otp.js";

import ApiError from "../utils/ApiError.js";

/* -------------------------------------------------------------------------- */
/*                          Generate OTP                                      */
/* -------------------------------------------------------------------------- */

export const generateOtpService = async (
  email,
  purpose
) => {

  // Delete previous OTPs
  await Otp.deleteMany({
    email,
    purpose,
  });

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await Otp.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(
      Date.now() + 10 * 60 * 1000
    ),
  });

  return otp;
};

/* -------------------------------------------------------------------------- */
/*                         Verify OTP                                         */
/* -------------------------------------------------------------------------- */

export const verifyOtpService = async (
  email,
  otp,
  purpose
) => {

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const otpRecord =
    await Otp.findOne({
      email,
      purpose,
      otp: hashedOtp,
      isUsed: false,
    });

  if (!otpRecord) {
    throw new ApiError(
      400,
      "Invalid OTP."
    );
  }

  if (
    otpRecord.expiresAt < new Date()
  ) {
    throw new ApiError(
      400,
      "OTP has expired."
    );
  }

  otpRecord.isUsed = true;

  await otpRecord.save();

  return true;
};