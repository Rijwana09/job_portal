import { body } from "express-validator";
import ROLES from "../constants/roles.js";

/*
|--------------------------------------------------------------------------
| Register Validation
|--------------------------------------------------------------------------
*/

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can contain only letters and spaces"),

  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&#^()_\-+=]/)
    .withMessage(
      "Password must contain at least one special character"
    ),

  body("role")
    .optional()
    .isIn([ROLES.STUDENT, ROLES.RECRUITER])
    .withMessage("Invalid role selected"),
];

/*
|--------------------------------------------------------------------------
| Login Validation
|--------------------------------------------------------------------------
*/

export const loginValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("rememberMe must be true or false"),
];

/*
|--------------------------------------------------------------------------
| Forgot Password Validation
|--------------------------------------------------------------------------
*/

export const forgotPasswordValidation = [
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
];

/*
|--------------------------------------------------------------------------
| Reset Password Validation
|--------------------------------------------------------------------------
*/

export const resetPasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&#^()_\-+=]/)
    .withMessage(
      "Password must contain at least one special character"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];


  /*
|--------------------------------------------------------------------------
| Verify Email Validation
|--------------------------------------------------------------------------
*/

  export const verifyEmailValidation = [
    body("token")
      .trim()
      .notEmpty()
      .withMessage("Verification token is required")
      .isString()
      .withMessage("Verification token must be a string"),
];
/*
|--------------------------------------------------------------------------
| Update Profile Validation
|--------------------------------------------------------------------------
*/

export const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email address"),
];