const express = "express";

const server = express();

// Install some middleware here.
server.use(logger);

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
