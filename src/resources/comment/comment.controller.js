import { Comment } from "./comment.model.js";

const getAllCommentOfPin = (model) => async (req, res) => {
  try {
    const comment = await model
      .find({ pinId: req.params.id })
      .populate("createdBy");
    res.send({ data: comment });
  } catch (e) {
    res.status(400).send({ error: "Error getting comment" });
  }
};

const createComment = (model) => async (req, res) => {
  try {
    const comment = await model.create(req.body);
    res.send({ data: comment });
  } catch (e) {
    res.status(400).send({ error: "Error creating comment" });
  }
};

const DeleteComment = (model) => async (req, res) => {
  try {
    const comment = await model.findByIdAndDelete(req.params.id);
    res.send({ data: comment });
  } catch (e) {
    res.status(400).send({ error: "Error deleting comment" });
  }
};

const controller = (model) => {
  return {
    getAllCommentOfPin: getAllCommentOfPin(model),
    createComment: createComment(model),
    deleteComment: DeleteComment(model),
  };
};

export const commentController = controller(Comment);
