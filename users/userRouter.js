const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

router.get("/", (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "There are no posts" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/", validatePost, (req, res) => {
  Users.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

router.post("/:id/posts", validatePost, validateUserId, async (req, res) => {
  const postInfo = { ...req.body, post_id: req.params.id };
  try {
    const post = await Posts.insert(postInfo);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const deleted = await Users.remove(id);
    res.status(200).json({ deleted });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:id", validateUser, validateUserId, async (req, res) => {
  const { id } = req.params;
  const userInfo = req.body;
  try {
    const update = await Users.update(id, userInfo);
    res.status(204).json({ message: "User updated", update });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//Custom middleware
function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next(new Error("User does not exist"));
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
}

function validateUser(req, res, next) {
  // If user exists in req.body
  if (!req.body) {
    // Req.body is missing ? res.status(400).json({ message: "Missing post data" })
    res.status(400).json({ message: "Missing user data" });
  } else if (!req.body.name) {
    // Req.body is missing the name field ? res.status(400).json({ message: "Missing required name field" })
    res.status(400).json({ message: "Missing required name field" });
  } else {
    // This is the truthy component
    next();
  }
}

function validatePost(req, res, next) {
  // If post exists in req.body
  if (!req.body) {
    // Req.body is missing ? res.status(400).json({ message: "Missing post data" })
    res.status(400).json({ message: "Missing post data" });
  } else if (!req.body.text) {
    // Req.body is missing the text field ? res.status(400).json({ message: "Missing required text field" })
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
