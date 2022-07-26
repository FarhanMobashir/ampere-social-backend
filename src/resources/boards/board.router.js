import { Router } from "express";
import { boardController } from "./board.controller.js";
const boardRouter = Router();

// /api/item
boardRouter
  .route("/")
  .get(boardController.getMany)
  .post(boardController.createOne);

// /api/item/:id
boardRouter
  .route("/:id")
  .get(boardController.getOne)
  .put(boardController.updateOne)
  .delete(boardController.deleteOne);

boardRouter.route("/user/:id").get(boardController.getManyForUser);

boardRouter.route("/user/:id/:boardId").get(boardController.getOneForUser);

export default boardRouter;
