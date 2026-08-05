import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import hashToken from "../utils/hashToken.js";

class AuthService {
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
}

export default new AuthService();