import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";



// ==============================
// Register User
// ==============================

export const registerUserService = async (userData) => {

    const { fullName, username, email, password } = userData;

    // Check if email or username already exists
    const existingUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });

    if (existingUser) {

        if (existingUser.email === email) {
            throw new ApiError(409, "Email already exists");
        }

        if (existingUser.username === username) {
            throw new ApiError(409, "Username already exists");
        }
    }

    // Create new user
    const user = await User.create({
        fullName,
        username,
        email,
        password,
    });

    // Fetch user without password
    const createdUser = await User.findById(user._id).select("-password");

    return createdUser;
};



// ==============================
// Login User
// ==============================

export const loginUserService = async (email, password) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user);

    // Remove password before returning
    user.password = undefined;

    return {
        user,
        token,
    };
};



// ==============================
// Get Current User
// ==============================

export const getCurrentUserService = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};