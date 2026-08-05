import jwt from "jsonwebtoken";

import { jwtConfig } from "../config/jwt.js";

const protect = (
  req,
  res,
  next
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    token =
      req.headers.authorization.split(
        " "
      )[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    req.user = jwt.verify(
      token,
      jwtConfig.accessSecret
    );

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default protect;