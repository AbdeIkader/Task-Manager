import { Router } from "express";
const authRouter = Router();
import * as auth from "./auth.controller.js";

authRouter.post("/signup", auth.signUp);
authRouter.post("/signin", auth.signIn);

export default authRouter;
