import { Router } from "express";
import { authValidate } from "../middlewares/authValidation.middleware.js";
import { userInfo, ranking } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/users/me", authValidate, userInfo);
userRouter.get("/ranking", ranking);

export default userRouter;
