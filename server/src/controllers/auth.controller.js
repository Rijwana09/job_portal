import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

import { refreshCookieOptions } from "../config/cookies.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message: "User registered successfully",
        data: user,
      })
    );
  });

  login = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await authService.login(req.body);

    res.cookie(
      "refreshToken",
      refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Login successful",
        data: {
          accessToken,
          user,
        },
      })
    );
  });
}

export default new AuthController();