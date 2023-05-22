import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import urlRouter from "./routes/url.routes.js";
import userRouter from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(urlRouter);
app.use(userRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port: ${port}`));
