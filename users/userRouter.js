const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

// Custom middleware ———————————————————————————————————————

// Operational
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

// Operational
const validateUserBody = async (req, res, next) => {
  !req.body
    ? res.status(400).json({ message: "No data received" })
    : !req.body.name
    ? res.status(400).json({ message: "Missing required name value" })
    : next();
};

// Operational
const validatePostBody = async (req, res, next) => {
  !req.body
    ? res.status(400).json({ message: "No data received" })
    : !req.body.text
    ? res.status(400).json({ message: "Missing required text value" })
    : next();
};

// Routes —————————————————————————————————————————————————

// Operational
router.get("/", async (req, res) => {
  try {
    const users = await Users.get(req.query);
    res.status(200).json({ message: "Successfully Retrieved Users", users });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Operational
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

// Operational
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

// Operational
router.post("/", validateUserBody, async (req, res) => {
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json({ message: "New user created", newUser });
  } catch (error) {
    res.status(500).json({ error: "Couldn't add user" });
  }
});

// Operational
router.post("/:id/posts", validatePostBody, validateID, async (req, res) => {
  try {
    const postInfo = req.body;
    postInfo.user_id = req.params.id;
    const post = await Posts.insert(postInfo);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Couldn't add post to user" });
  }
});

// Operational
router.delete("/:id", validateID, async (req, res) => {
  try {
    const deleted = await Users.remove(req.params.id);
    res.status(202).json({ message: `We're sorry to see you go!` });
  } catch (error) {
    res.status(500).json({ error: "Couldn't delete user" });
  }
});

router.put("/:id", validateUserBody, validateID, async (req, res) => {
  const updated = req.body;
  const { id } = req.params;
  try {
    const update = await Users.update(id, updated);
    res.status(200).json({ message: "User updated successfully", update });
  } catch (error) {
    res.status(500).json({ error: "Couldn't update user" });
  }
});

module.exports = router;
