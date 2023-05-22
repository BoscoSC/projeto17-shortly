import { Router } from "express";
import { authValidate } from "../middlewares/authValidation.middleware.js";
import { userInfo } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/users/me", authValidate, userInfo);
userRouter.get("/ranking");

export default userRouter;
