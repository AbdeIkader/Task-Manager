import { catchAsyncError } from "./../../utils/catchAsyncError.js";
import { userModel } from "./../../../DB/models/user.model.js";
import { AppError } from "./../../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    return next(new AppError("User already exists", 409));
  }

  const newUser = new userModel({
    name,
    email,
    password,
  });

  await newUser.save();

  // Create JWT token in case the user after sign up can enter the application directly
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(201).json({
    success: true,
    message: "User signed up succesfully",
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
    token,
  });
});

const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
console.log({email,password});
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(password);
  console.log(user.password);
  console.log(isMatch);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});
export { signUp, signIn };
