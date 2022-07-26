import { User } from "./user.model.js";

export const me = async (req, res) => {
  try {
    return res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(400).end();
  }
};

export const updateMe = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.send({ data: user });
  } catch (e) {
    res
      .status(400)
      .send({
        error: "Error updating user",
      })
      .end();
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
    const user = await User.findById(req.user._id)
      .select("following")
      .lean()
      .exec();

    const userToFollow = await User.findById(req.params.id)
      .select("followers")
      .lean()
      .exec();

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    user.following.push(req.params.id);
    await User.findByIdAndUpdate(req.user._id, user, { new: true });
    res.send({ data: user });
    userToFollow.followers.push(req.user._id);
    await User.findByIdAndUpdate(req.params.id, userToFollow, { new: true });
  } catch (e) {
    res.status(400).send({ error: "Error following user" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("following").exec();

    const userToUnfollow = await User.findById(req.params.id)
      .select("followers")
      .exec();

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    console.log(user.following);
    user.following.pull(req.params.id);
    await User.findByIdAndUpdate(req.user._id, user, { new: true });
    userToUnfollow.followers.pull(req.user._id);
    await User.findByIdAndUpdate(req.params.id, userToUnfollow, { new: true });
    res.send({ data: user });
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
