const express = require("express");
const Posts = require("./postDb.js");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get(req.query)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.params.id).then();
  res.status(204).json({ message: "Successfully deleted" });
});

router.put("/:id", validatePostId, (req, res) => {
  res.status();
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        next(new Error("Post does not exist"));
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err });
    });
}

module.exports = router;
