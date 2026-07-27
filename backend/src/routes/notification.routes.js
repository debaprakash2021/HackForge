import express from "express";

import {
  sendOtp,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/notification.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                               OTP                                          */
/* -------------------------------------------------------------------------- */

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

/* -------------------------------------------------------------------------- */
/*                          Password Reset                                    */
/* -------------------------------------------------------------------------- */

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

export default router;