const express = require("express");
const Users = require("./userDb.js");
const Posts = require("../posts/postDb.js");

const router = express.Router();

// Working
router.get("/", (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// Working
router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Working
router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id);
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "There are no posts" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Working
router.post("/", validateUser, async (req, res) => {
  console.log(req.body);
  try {
    const newUser = await Users.insert(req.body);
    res.status(201).json({ message: "Successfully added user", newUser });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Working
router.post("/:id/posts", validatePost, validateUserId, async (req, res) => {
  const postInfo = req.body;
  postInfo.user_id = req.params.id;
  try {
    const post = await Posts.insert(postInfo);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Working
router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const deleted = await Users.remove(req.params.id);
    res.status(200).json({ boolean: deleted });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Not working
router.put("/:id", validateUser, validateUserId, async (req, res) => {
  const updated = req.body;
  const { id } = req.params;
  try {
    const update = await Users.update(id, updated);
    res.status(200).json({ message: "User updated", update });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//Custom middleware

// Working
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

// Not Working
function validateUser(req, res, next) {
  console.log(req.body);
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

// Not Working
function validatePost(req, res, next) {
  // If post exists in req.body
  if (!req.body) {
    // Req.body is missing ? res.status(400).json({ message: "Missing post data" })
    res.status(400).json({ message: "Missing post data" });
  } else if (!req.body.text) {
    // Req.body is missing the text field ? res.status(400).json({ message: "Missing required text field" })
    res.status(400).json({ message: "Missing required text field" });
  } else {
    // This is the truthy component
    next();
  }
}

module.exports = router;
