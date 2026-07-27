import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import User from "../models/User.js";

import {
  generateOtpService,
  verifyOtpService,
} from "../services/otp.service.js";

import { sendEmailService } from "../services/email.service.js";

import {
  otpEmailTemplate,
  passwordResetTemplate,
} from "../constants/emailTemplates.js";

/* -------------------------------------------------------------------------- */
/*                             Send OTP                                       */
/* -------------------------------------------------------------------------- */

export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otp = await generateOtpService(
    email,
    "EMAIL_VERIFICATION"
  );

  await sendEmailService({
    to: email,
    subject: "HackForge Email Verification",
    html: otpEmailTemplate(user.name, otp),
  });

  return res.status(200).json(
    new ApiResponse(200, "OTP sent successfully.")
  );
});

/* -------------------------------------------------------------------------- */
/*                           Verify OTP                                       */
/* -------------------------------------------------------------------------- */

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOtpService(
    email,
    otp,
    "EMAIL_VERIFICATION"
  );

  await User.findOneAndUpdate(
    { email },
    {
      isEmailVerified: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Email verified successfully."
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                          Resend OTP                                        */
/* -------------------------------------------------------------------------- */

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otp = await generateOtpService(
    email,
    "EMAIL_VERIFICATION"
  );

  await sendEmailService({
    to: email,
    subject: "HackForge Email Verification",
    html: otpEmailTemplate(user.name, otp),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "OTP resent successfully."
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                       Forgot Password                                      */
/* -------------------------------------------------------------------------- */

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const otp = await generateOtpService(
    email,
    "PASSWORD_RESET"
  );

  await sendEmailService({
    to: email,
    subject: "Reset Password",
    html: passwordResetTemplate(
      user.name,
      otp
    ),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset OTP sent."
    )
  );
});

/* -------------------------------------------------------------------------- */
/*                       Reset Password                                       */
/* -------------------------------------------------------------------------- */

export const resetPassword = asyncHandler(async (req, res) => {
  const {
    email,
    otp,
    newPassword,
  } = req.body;

  await verifyOtpService(
    email,
    otp,
    "PASSWORD_RESET"
  );

  const user = await User.findOne({ email });

  user.password = newPassword;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset successful."
    )
  );
});