import { Router } from "express";
import {
  followUser,
  getAllFollowers,
  getAllFollowing,
  getAllUsers,
  getSingleUser,
  me,
  unfollowUser,
  updateMe,
} from "./user.controller.js";

const userRouter = Router();

// acive user
userRouter.get("/me", me);
userRouter.get("/all", getAllUsers);
userRouter.put("/me", updateMe);
userRouter.put("/follow/:id", followUser);
userRouter.put("/unfollow/:id", unfollowUser);
userRouter.get("/followings", getAllFollowing);
userRouter.get("/followers", getAllFollowers);
userRouter.get("/:id", getSingleUser);

export default userRouter;
