import { Router } from "express";

import { commentController } from "./comment.controller.js";

const commentRouter = Router();

commentRouter.route("/").post(commentController.createComment);

// here id is pin id
commentRouter
  .route("/:id")
  .get(commentController.getAllCommentOfPin)

  .delete(commentController.deleteComment);

export default commentRouter;
