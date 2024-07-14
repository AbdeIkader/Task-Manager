import jwt from "jsonwebtoken";
import { userModel } from "./../../DB/models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";

const verifyAndAuthorize = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Failed to authenticate token", 401));
  }

  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
});

export { verifyAndAuthorize };
