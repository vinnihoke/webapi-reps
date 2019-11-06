const express = "express";
const Users = require("./userDb.js");

const router = express.Router();

router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

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
  // Req.body is missing ? res.status(400).json({ message: "Missing post data" })
  // Req.body is missing the name field ? res.status(400).json({ message: "Missing required name field" })
}

function validatePost(req, res, next) {
  // If post exists in req.body
  // Req.body is missing ? res.status(400).json({ message: "Missing post data" })
  // Req.body is missing the text field ? res.status(400).json({ message: "Missing required text field" })
}

module.exports = router;
