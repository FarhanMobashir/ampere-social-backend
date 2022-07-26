import { Router } from "express";
import { pinController } from "./pin.controller.js";

const pinRouter = Router();

pinRouter.route("/").get(pinController.getAll).post(pinController.create);

pinRouter
  .route("/:id")
  .get(pinController.getOne)
  .put(pinController.update)
  .delete(pinController.delete);

export default pinRouter;
