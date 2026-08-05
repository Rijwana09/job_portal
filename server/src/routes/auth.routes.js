import express from "express";

import authController from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

export default router;