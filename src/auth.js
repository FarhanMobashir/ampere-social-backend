import jwt from "jsonwebtoken";
import { User } from "./resources/user/user.model.js";

export const newToken = (user) => {
  return jwt.sign({ id: user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(400).send({ error: "need email and password" });
  } else {
    try {
      const user = await User.create(req.body);
      const token = newToken(user);
      return res.status(201).send({ token, user, mode: "signup" });
    } catch (e) {
      return res.status(401).send({ error: "User already exist" });
    }
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ error: "need email and password" });
  }

  const invalid = { error: "Invalid email and password combination" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("-password")
      .exec();
    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({ token, user, mode: "signin" });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ error: "You must be logged in to access this resource" })
      .end();
  }

  let token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).send({ error: "Invalid token" }).end();
  }
  const user = await User.findById(payload.id)
    .select("-password")
    .lean()
    .exec();
  if (!user) {
    return res.status(401).send({ error: "User not found" }).end();
  }
  req.user = user;
  next();
};
