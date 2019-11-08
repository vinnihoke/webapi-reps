const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

const server = express();

// Install some middleware here.
server.use(express.json());
server.use(helmet());
// server.use(logger);
server.use(morgan("dev"));
server.use("/api/users", userRouter);
server.use("/api/users/:id/posts", postRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//Custom middleware goes here.

function logger(req, res, next) {
  console.log(
    `${req.method} Request ::: ${
      req.url
    } ::: ${new Date().toISOString()} ::: from ${req.get("Origin")}`
  );
  next();
}

module.exports = server;
