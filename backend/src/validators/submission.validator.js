import { body, param, validationResult } from "express-validator";

// Create Submission
export const createSubmissionValidator = [
  body("registration")
    .isMongoId()
    .withMessage("Invalid Registration ID"),

  body("projectTitle")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ max: 150 })
    .withMessage("Project title cannot exceed 150 characters"),

  body("projectDescription")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ max: 5000 })
    .withMessage("Project description cannot exceed 5000 characters"),

  body("githubRepo")
    .trim()
    .isURL()
    .withMessage("Invalid GitHub Repository URL"),

  body("liveDemo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid Live Demo URL"),

  body("videoDemo")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid Video Demo URL"),

  body("techStack")
    .isArray({ min: 1 })
    .withMessage("At least one technology is required"),
];

// Update Submission
export const updateSubmissionValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Submission ID"),
];

// Validate Middleware
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