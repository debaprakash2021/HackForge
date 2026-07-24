import { param, validationResult } from "express-validator";

export const leaderboardValidator = [
  param("hackathonId")
    .isMongoId()
    .withMessage("Invalid Hackathon ID"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  next();
};