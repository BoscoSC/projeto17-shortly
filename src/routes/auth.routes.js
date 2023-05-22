import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import userSchema from "../schemas/userSchema.js";
import { register } from "../controllers/users.controllers.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(userSchema), register);

export default authRouter;
