import { AppError } from "../utils/AppError.js";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError("Failed to authenticate token", 401));
    }
    req.userId = decoded.userId;
    next();
  });
};

export { verifyToken };
