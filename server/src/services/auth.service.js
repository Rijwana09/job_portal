
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import hashToken from "../utils/hashToken.js";

import { jwtConfig } from "../config/jwt.js";

import emailService from "../services/email.service.js";

import generateSecureToken from "../utils/generateSecureToken.js";

class AuthService {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  async register(userData) {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Generate secure verification token
  const { token, hashedToken } = generateSecureToken();

  // Store only the hashed token
  user.verificationToken = hashedToken;

  // Token valid for 24 hours
  user.verificationTokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await user.save();

  // Build verification URL
  const verificationUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Send verification email
  await emailService.sendVerificationEmail({
    email: user.email,
    name: user.name,
    verificationUrl,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  async login({ email, password }) {
    const user = await User.findOne({ email }).select(
      "+password +refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isVerified) {
      throw new ApiError(
        403,
        "Please verify your email before logging in."
      );
    }


    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      hashToken(refreshToken);

    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    };
  }

  /*
|--------------------------------------------------------------------------
| Verify Email
|--------------------------------------------------------------------------
*/

  async verifyEmail(token) {
    if (!token) {
      throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
    }).select("+verificationToken");

    if (!user) {
      throw new ApiError(400, "Invalid verification token");
    }

    if (
      !user.verificationTokenExpiresAt ||
      user.verificationTokenExpiresAt < new Date()
    ) {
      throw new ApiError(400, "Verification token has expired");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email is already verified");
    }

    user.isVerified = true;

    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Refresh Access Token
  |--------------------------------------------------------------------------
  */

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        jwtConfig.refreshSecret
      );
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select(
      "+refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const hashedToken = hashToken(refreshToken);

    if (user.refreshToken !== hashedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const newAccessToken =
      generateAccessToken(user);

    const newRefreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      hashToken(newRefreshToken);

    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  async logout(userId) {
    const user = await User.findById(userId).select(
      "+refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = null;

    await user.save();

    return true;
  }
}

export default new AuthService();
