import formidable from "formidable";
import { Board } from "../boards/board.model.js";
import { Pin } from "./pin.model.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

// to get all pins of a board
const getAllPins = (model) => async (req, res) => {
  const boardId = req.params.id;
  try {
    const pins = await model.find({}).populate("createdBy");
    res.send({ data: pins });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "Error getting pins" }).end();
  }
};

// to get single pin of a board
const getSinglePin = (model) => async (req, res) => {
  const pinId = req.params.id;
  try {
    const pin = await model.find({
      _id: pinId,
      createdBy: req.user._id,
    });
    res.send({ data: pin });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "Error getting pin" }).end();
  }
};

// board id : 62d99fae34c2a1c70bca6cfb

// to create a pin
const createPin = (model) => async (req, res) => {
  try {
    let body = {};
    // ------------------------------------------------------
    const uploadImageToCloudinary = async (image) => {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const result = await cloudinary.v2.uploader.upload(image);
      return result;
    };
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (files.image) {
        body = {
          ...fields,
          image: await uploadImageToCloudinary(files.image.filepath)
            .then((result) => {
              return result.secure_url;
            })
            .catch((e) => {
              console.error(e);
            }),
        };
        const pin = await model.create({
          ...body,
          createdBy: req.user._id,
        });

        const boardToAddPin = await Board.findOne({
          _id: body.boardId,
          createdBy: req.user._id,
        }).exec();
        if (!boardToAddPin) {
          return res.status(400).send({ error: "Board not found" });
        }
        boardToAddPin.pins.push(pin._id);
        await boardToAddPin.save();
        res.send({ data: pin });
      } else {
        res.send({ error: "No image" });
      }
      console.log(fields);
    });
    // form.on("file", async (field, file) => {
    //   await uploadImageToCloudinary(file.filepath)
    //     .then((url) => {
    //       body.image = url.secure_url;
    //     })
    //     .catch((err) => {
    //       console.log({ err });
    //     });
    // });

    // form.on("field", async (name, value) => {
    //   body[name] = value;
    // });

    // const pin = await model.create({
    //   ...body,
    //   createdBy: req.user._id,
    // });

    // const boardToAddPin = await Board.findOne({
    //   _id: body.boardId,
    //   createdBy: req.user._id,
    // }).exec();
    // if (!boardToAddPin) {
    //   return res.status(400).send({ error: "Board not found" });
    // }
    // boardToAddPin.pins.push(pin._id);
    // await boardToAddPin.save();
    // res.send({ data: pin });
    // ------------------------------------------------------
    // res.send({ data: "ok" });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "Error creating pin" }).end();
  }
};

// to update a pin
const updatePin = (model) => async (req, res) => {
  const pinId = req.params.id;
  try {
    const pin = await model.findOneAndUpdate(
      {
        _id: pinId,
        createdBy: req.user._id,
      },
      req.body,
      { new: true }
    );
    if (!pin) {
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

// to delete a pin
const deletePin = (model) => async (req, res) => {
  const pinId = req.params.id;
  try {
    const pin = await model.findOneAndDelete({
      _id: pinId,
      createdBy: req.user._id,
    });
    if (!pin) {
      return res.status(400).end();
    }

    const boardToRemovePin = await Board.findOne({
      _id: pin.boardId,
      createdBy: req.user._id,
    }).exec();
    if (!boardToRemovePin) {
      return res.status(400).send({ error: "Board not found" });
    }
    boardToRemovePin.pins.pull(pin._id);
    await boardToRemovePin.save();

    res
      .status(200)
      .json({ data: await model.find({ createdBy: req.user._id }) });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

const savePin = (model) => async (req, res) => {
  const boardToAddPin = await Board.findOne({
    _id: req.body.boardId,
    createdBy: req.user._id,
  }).exec();
  if (!boardToAddPin) {
    return res.status(400).send({ error: "Board not found" });
  }
  boardToAddPin.pins.push(req.body._id);
  await boardToAddPin.save();
  res.send({ data: req.body });
};

const removePin = (model) => async (req, res) => {
  const boardToRemovePin = await Board.findOne({
    _id: req.body.boardId,
    createdBy: req.user._id,
  }).exec();
  if (!boardToRemovePin) {
    return res.status(400).send({ error: "Board not found" });
  }
  boardToRemovePin.pins.pull(req.body._id);
  await boardToRemovePin.save();
  res.send({ data: req.body });
};

const controller = (model) => ({
  getOne: getSinglePin(model),
  getAll: getAllPins(model),
  create: createPin(model),
  update: updatePin(model),
  delete: deletePin(model),
  savePin: savePin(model),
  removePin: removePin(model),
});

export const pinController = controller(Pin);
