const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

const server = express();

// This is our middleware
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use("/api/users", userRouter);
server.use("/api/users/:id/posts", postRouter);

server.get("/", (req, res) => {
  res.status(100).json({ message: "API Ready." });
});

module.exports = server;
