import { body, param, validationResult } from "express-validator";

// Assign Judge
export const assignJudgeValidator = [
  body("hackathon")
    .isMongoId()
    .withMessage("Invalid Hackathon ID"),

  body("judge")
    .isMongoId()
    .withMessage("Invalid Judge ID"),
];

// Delete Assignment
export const assignmentIdValidator = [
  param("assignmentId")
    .isMongoId()
    .withMessage("Invalid Assignment ID"),
];

// Hackathon ID
export const hackathonIdValidator = [
  param("hackathonId")
    .isMongoId()
    .withMessage("Invalid Hackathon ID"),
];

// Validation Middleware
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