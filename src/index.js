import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { protect, signin, signup } from "./auth.js";
import userRouter from "./resources/user/user.router.js";
import boardRouter from "./resources/boards/board.router.js";
import pinRouter from "./resources/pin/pin.router.js";

const app = express();
dotenv.config();
app.disable("x-powered-by");
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Server" });
});

// auth
app.post("/signup", signup);
app.post("/signin", signin);

// protect
app.use("/api", protect);
// user
app.use("/api/user", userRouter);
// board
app.use("/api/boards", boardRouter);
// pin
app.use("/api/pins", pinRouter);

mongoose.connect(process.env.MONGO_URI).then((data) => {
  console.log("mongo connected");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `App listening on http://${process.env.HOSTNAME}:${process.env.PORT}/api`
  );
});
