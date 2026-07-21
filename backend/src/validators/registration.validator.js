import { body, param, validationResult } from "express-validator";

// Register for Hackathon
export const createRegistrationValidator = [
  body("hackathon")
    .notEmpty()
    .withMessage("Hackathon ID is required")
    .isMongoId()
    .withMessage("Invalid Hackathon ID"),
];

// Approve / Reject Registration
export const updateRegistrationStatusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Registration ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Approved", "Rejected"])
    .withMessage("Status must be either Approved or Rejected"),

  body("remarks")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Remarks cannot exceed 500 characters"),
];

// Common Validation Middleware
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