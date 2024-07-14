import { Router } from "express";
const authRouter = Router();
import * as auth from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { signInSchema, signUpSchema } from "./auth.validation.js";

authRouter.post("/signup", validate(signUpSchema), auth.signUp);
authRouter.post("/signin", validate(signInSchema), auth.signIn);

export default authRouter;
