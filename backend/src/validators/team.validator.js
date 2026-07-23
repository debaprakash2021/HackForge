import { body, param, validationResult } from "express-validator";

export const createTeamValidator = [
  body("teamName")
    .trim()
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Team name must be between 3 and 50 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("hackathon")
    .notEmpty()
    .withMessage("Hackathon ID is required")
    .isMongoId()
    .withMessage("Invalid Hackathon ID"),
];

export const joinTeamValidator = [
  body("teamCode")
    .trim()
    .notEmpty()
    .withMessage("Team code is required"),
];

export const transferLeadershipValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Team ID"),

  body("newLeader")
    .isMongoId()
    .withMessage("Invalid User ID"),
];

export const teamIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Team ID"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array(),
    });
  }

  next();
};