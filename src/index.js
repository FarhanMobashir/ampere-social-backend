import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { User } from "./resources/user/user.model.js";

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

mongoose.connect(process.env.MONGO_URI).then((data) => {
  console.log("mongo connected");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `App listening on http://${process.env.HOSTNAME}:${process.env.PORT}/api`
  );
});
