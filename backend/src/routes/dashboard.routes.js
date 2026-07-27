import express from "express";

import {
    getAdminDashboard,
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import { ROLES } from "../constants/roles.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/admin",
    authMiddleware,
    authorizeRoles(ROLES.ADMIN),
    getAdminDashboard
);

export default router;