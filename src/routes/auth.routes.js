import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import userSchema from "../schemas/userSchema.js";
import loginSchema from "../schemas/loginSchema.js";
import { register, login } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(userSchema), register);
authRouter.post("/signin", validateSchema(loginSchema), login);

export default authRouter;
