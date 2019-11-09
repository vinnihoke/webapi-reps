const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

// Custom middleware ———————————————————————————————————————

const validateID = async (req, res, next) => {
  try {
    const user = await Users.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      next(new Error("User does not exist"));
    }
  } catch (error) {
    res.status(500).json({ error: "ID not validated" });
  }
};

const validateUserBody = async (req, res, next) => {
  !req.body
    ? res.status(400).json({ message: "Missing user data" })
    : !req.body.name
    ? res.status(400).json({ message: "Missing" })
    : next();
};

// Routes —————————————————————————————————————————————————

router.get("/", async (req, res) => {
  try {
    const users = await Users.get(req.query);
    res.status(200).json({ message: "Successfully Retrieved Users", users });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", validateID, async (req, res) => {
  try {
    const user = await Users.getById(req.params.id);
    res
      .status(200)
      .json({ message: "Successfully Retrieved Individual User", user });
  } catch (error) {
    res.status(500).json({ message: "Could not retrieve user" });
  }
});

router.get("/:id/posts", validateID, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    posts.length
      ? res.status(200).json(posts)
      : res.status(404).json({ message: "There are no posts" });
  } catch (error) {
    res.status(500).json({ error: "Couldn't find posts" });
  }
});

router.post("/", validateUserBody, async (req, res) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json({ message: "New user created", newUser });
  } catch (error) {
    res.status(500).json({ error: "Couldn't add user" });
  }
});

module.exports = router;
