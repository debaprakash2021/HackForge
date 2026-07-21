import { body, validationResult } from "express-validator";

// Create Hackathon Validation
export const createHackathonValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 150 })
    .withMessage("Title must be between 5 and 150 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("theme")
    .trim()
    .notEmpty()
    .withMessage("Theme is required"),

  body("mode")
    .notEmpty()
    .withMessage("Mode is required")
    .isIn(["Online", "Offline", "Hybrid"])
    .withMessage("Mode must be Online, Offline or Hybrid"),

  body("venue")
    .optional()
    .trim(),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date"),

  body("registrationDeadline")
    .notEmpty()
    .withMessage("Registration deadline is required")
    .isISO8601()
    .withMessage("Invalid registration deadline"),

  body("banner")
    .optional()
    .isString()
    .withMessage("Banner must be a string"),

  body("prizePool")
    .notEmpty()
    .withMessage("Prize pool is required")
    .isNumeric()
    .withMessage("Prize pool must be a number")
    .custom((value) => value >= 0)
    .withMessage("Prize pool cannot be negative"),

  body("maxTeamSize")
    .notEmpty()
    .withMessage("Maximum team size is required")
    .isInt({ min: 1, max: 10 })
    .withMessage("Team size must be between 1 and 10"),

  body("rules")
    .optional()
    .isArray()
    .withMessage("Rules must be an array"),

  body("judgingCriteria")
    .optional()
    .isArray()
    .withMessage("Judging criteria must be an array"),
];

// Update Hackathon Validation
export const updateHackathonValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage("Title must be between 5 and 150 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("theme")
    .optional()
    .trim(),

  body("mode")
    .optional()
    .isIn(["Online", "Offline", "Hybrid"])
    .withMessage("Mode must be Online, Offline or Hybrid"),

  body("venue")
    .optional()
    .trim(),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date"),

  body("registrationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid registration deadline"),

  body("banner")
    .optional()
    .isString()
    .withMessage("Banner must be a string"),

  body("prizePool")
    .optional()
    .isNumeric()
    .withMessage("Prize pool must be a number"),

  body("maxTeamSize")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Team size must be between 1 and 10"),

  body("rules")
    .optional()
    .isArray()
    .withMessage("Rules must be an array"),

  body("judgingCriteria")
    .optional()
    .isArray()
    .withMessage("Judging criteria must be an array"),

  body("registrationStatus")
    .optional()
    .isIn(["Open", "Closed"])
    .withMessage("Registration status must be Open or Closed"),

  body("status")
    .optional()
    .isIn(["Upcoming", "Ongoing", "Completed"])
    .withMessage("Status must be Upcoming, Ongoing or Completed"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be boolean"),
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