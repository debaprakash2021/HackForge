import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    getAdminDashboardService,
} from "../services/dashboard.service.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {

    const dashboard =
        await getAdminDashboardService();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Admin dashboard fetched successfully",
            dashboard
        )
    );
});