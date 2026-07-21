import jwt from "jsonwebtoken";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {

    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized. Please login.");
    }

    // Verify token
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        throw new ApiError(401, "User not found.");
    }

    // Check blocked user
    if (user.isBlocked) {
        throw new ApiError(403, "Your account has been blocked.");
    }

    // Attach user to request
    req.user = user;

    next();

});

export default authMiddleware;