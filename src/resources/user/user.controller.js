import formidable from "formidable";
import { User } from "./user.model.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

export const me = async (req, res) => {
  try {
    return res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(400).end();
  }
};

export const updateMe = async (req, res) => {
  // ---------------------------------
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
    form.uploadDir = process.cwd() + "/src/uploads";
    form.on("fileBegin", (name, file) => {
      file.filepath = form.uploadDir + "/" + file.originalFilename;
    });
    form.parse(req, async (err, fields, files) => {
      console.log(fields);

      if (!files.avatar) {
        body = {
          ...fields,
        };
        const user = await User.findByIdAndUpdate(req.user._id, body, {
          new: true,
        })
          .lean()
          .exec();

        res.send({ data: user });
      }
      if (files.avatar) {
        files.avatar.filepath =
          process.cwd() + "/src/uploads/" + files.avatar.originalFilename;
        fs.rename(
          files.avatar.filepath,
          process.cwd() + "/src/uploads/" + files.avatar.originalFilename
        );
        if (req.user.avatar) {
          cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });
          await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
        }
        body = {
          ...fields,
          avatar: {
            url: await uploadImageToCloudinary(files.avatar.filepath)
              .then((result) => {
                return result.secure_url;
              })
              .catch((e) => {
                console.error(e);
              }),
            public_id: await uploadImageToCloudinary(files.avatar.filepath)
              .then((result) => {
                return result.public_id;
              })
              .catch((e) => {
                console.error(e);
              }),
          },
        };
        const user = await User.findByIdAndUpdate(req.user._id, body, {
          new: true,
        })
          .lean()
          .exec();

        fs.unlink(
          process.cwd() + "/src/uploads/" + files.avatar.originalFilename
        );

        res.send({ data: user });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: "Error creating pin" }).end();
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    });
    res.send({ data: users });
  } catch (e) {
    res.status(400).send({ error: "Error getting users" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send({ data: user });
  } catch (e) {
    res.status(400).send({ error: "Error getting user" });
  }
};

export const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean().exec();

    const userToFollow = await User.findById(req.params.id).lean().exec();

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    if (!user.following.includes(userToFollow._id)) {
      user.following.push(req.params.id);
      await User.findByIdAndUpdate(req.user._id, user, { new: true });
      res.send({ data: user });
      userToFollow.followers.push(req.user._id);
      await User.findByIdAndUpdate(req.params.id, userToFollow, { new: true });
    }
  } catch (e) {
    res.status(400).send({ error: "Error following user" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    const userToUnfollow = await User.findById(req.params.id).exec();

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    if (user.following.includes(userToUnfollow._id)) {
      user.following.pull(req.params.id);
      await User.findByIdAndUpdate(req.user._id, user, { new: true });
      userToUnfollow.followers.pull(req.user._id);
      await User.findByIdAndUpdate(req.params.id, userToUnfollow, {
        new: true,
      });
      res.send({ data: user });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error unfollowing user" });
  }
};

export const getAllFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("following")
      .lean()
      .exec();

    const following = await User.find({
      _id: { $in: user.following, $ne: req.user._id },
    })
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.send({ data: following });
  } catch (e) {
    res.status(400).send({ error: "Error getting followings" });
  }
};

export const getAllFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("followers")
      .lean()
      .exec();

    const followers = await User.find({
      _id: { $in: user.followers, $ne: req.user._id },
    })
      .select("-password")
      .lean()
      .exec();
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.send({ data: followers });
  } catch (e) {
    res.status(400).send({ error: "Error getting followers" });
  }
};
