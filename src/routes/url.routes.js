import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import urlSchema from "../schemas/urlSchema.js";
import { authValidate } from "../middlewares/authValidation.middleware.js";
import { shorten, urlById } from "../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  authValidate,
  shorten
);
urlRouter.get("/urls/:id", urlById);

export default urlRouter;
