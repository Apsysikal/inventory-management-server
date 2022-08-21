import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import itemRouter from "./routes/item.route";
import userRouter from "./routes/user.route";
import listRouter from "./routes/list.route";

const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/list", listRouter);

export default app;
