import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

import { refreshCookieOptions } from "../config/cookies.js";

class AuthController {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message:
          "Registration successful. Please verify your email.",
        data: user,
      })
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Verify Email
  |--------------------------------------------------------------------------
  */

  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const user = await authService.verifyEmail(token);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Email verified successfully",
        data: user,
      })
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Refresh Access Token
  |--------------------------------------------------------------------------
  */

  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    const tokens =
      await authService.refreshAccessToken(
        refreshToken
      );

    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      refreshCookieOptions
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Access token refreshed successfully",
        data: {
          accessToken: tokens.accessToken,
        },
      })
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Logout successful",
      })
    );
  });
}

export default new AuthController();