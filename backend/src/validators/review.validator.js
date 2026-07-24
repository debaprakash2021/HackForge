import { body, param, validationResult } from "express-validator";

// Create Review
export const createReviewValidator = [
  body("submission")
    .isMongoId()
    .withMessage("Invalid Submission ID"),

  body("innovation")
    .isInt({ min: 0, max: 20 })
    .withMessage("Innovation score must be between 0 and 20"),

  body("technicalImplementation")
    .isInt({ min: 0, max: 20 })
    .withMessage("Technical score must be between 0 and 20"),

  body("uiUx")
    .isInt({ min: 0, max: 20 })
    .withMessage("UI/UX score must be between 0 and 20"),

  body("presentation")
    .isInt({ min: 0, max: 20 })
    .withMessage("Presentation score must be between 0 and 20"),

  body("impact")
    .isInt({ min: 0, max: 20 })
    .withMessage("Impact score must be between 0 and 20"),

  body("feedback")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Feedback cannot exceed 2000 characters"),
];

// Update Review
export const updateReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Review ID"),
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