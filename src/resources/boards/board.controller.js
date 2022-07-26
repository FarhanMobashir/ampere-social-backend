import { Board } from "./board.model.js";

export const getOneBoard = (model) => async (req, res) => {
  try {
    const board = await model.findById(req.params.id).populate("pins");
    res.send({ data: board });
  } catch (e) {
    res.status(400).send({ error: "Error getting board" });
  }
};
export const getManyBoards = (model) => async (req, res) => {
  try {
    const boards = await model.find({ createdBy: req.user._id });
    res.send({ data: boards });
  } catch (e) {
    res.status(400).send({ error: "Error getting boards" });
  }
};
export const createOneBoard = (model) => async (req, res) => {
  const createdBy = req.user._id;
  try {
    const board = await model.create({ ...req.body, createdBy });
    res
      .status(201)
      .json({ data: await model.find({ createdBy: req.user._id }) });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};
export const updateOneBoard = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id,
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec();
    if (!updatedDoc) {
      return res.status(400).end();
    }
    res
      .status(200)
      .json({ data: await model.find({ createdBy: req.user._id }) });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};
export const deleteOneBoard = (model) => async (req, res) => {
  try {
    const deletedDoc = await model.findOneAndDelete({
      createdBy: req.user._id,
      _id: req.params.id,
    });
    if (!deletedDoc) {
      return res.status(400).end();
    }
    res
      .status(200)
      .json({ data: await model.find({ createdBy: req.user._id }) });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

const getAllBoardsOfUser = (model) => async (req, res) => {
  try {
    const boards = await model.find({ createdBy: req.params.id });
    res.send({ data: boards });
  } catch (error) {
    res.status(400).send({ error: "Error getting boards" });
  }
};

const getSingleBoardOfUser = (model) => async (req, res) => {
  try {
    const board = await model.find({
      createdBy: req.params.id,
      _id: req.params.boardId,
    });
    res.send({ data: board });
  } catch (error) {
    res.status(400).send({ error: "Error getting board" });
  }
};

const controllers = (model) => ({
  getOne: getOneBoard(model),
  getMany: getManyBoards(model),
  createOne: createOneBoard(model),
  updateOne: updateOneBoard(model),
  deleteOne: deleteOneBoard(model),
  getManyForUser: getAllBoardsOfUser(model),
  getOneForUser: getSingleBoardOfUser(model),
});

export const boardController = controllers(Board);
