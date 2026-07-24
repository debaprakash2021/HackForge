import {
  registerUserService,
  loginUserService,
  getCurrentUserService,
} from "../services/auth.service.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import cookieOptions from "../constants/cookieOptions.js";




// Register User


export const registerUser = asyncHandler(async (req, res) => {

  const user = await registerUserService(req.body);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User registered successfully",
        user
      )
    );
});




// Login User


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginUserService(email, password);

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        "Login successful",
        {
          user,
          token,
        }
      )
    );
});




// Logout User


export const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", cookieOptions)
    .json(
      new ApiResponse(
        200,
        "Logout successful"
      )
    );
});




// Get Current User


export const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await getCurrentUserService(req.user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Current user fetched successfully",
        user
      )
    );
});