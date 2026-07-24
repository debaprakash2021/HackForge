import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import hackathonRoutes from "./routes/hackathon.routes.js";
import registrationRoutes from "./routes/registration.routes.js";
import teamRoutes from "./routes/team.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import judgeAssignmentRoutes from "./routes/judgeAssignment.routes.js";
import uploadRoutes from "./routes/upload.routes.js";




import ApiError from "./utils/ApiError.js";




const app = express();



// =========================
// Global Middlewares
// =========================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use((req, res, next) => {
  console.log("================================");
  console.log("METHOD :", req.method);
  console.log("URL    :", req.originalUrl);
  console.log("================================");
  next();
});


// =========================
// Routes
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HackForge Backend Running 🚀",
  });
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hackathons", hackathonRoutes);
app.use("/api/v1/registrations", registrationRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/submissions", submissionRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1/judge-assignments", judgeAssignmentRoutes);
app.use("/api/v1/uploads", uploadRoutes);


// =========================
// 404 Route
// =========================

app.use((req, res, next) => {
  next(new ApiError(404, "Route Not Found"));
});

app.use(errorHandler);

export default app;