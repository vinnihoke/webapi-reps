// code away!
require("dotenv").config();
const server = require("./server.js");

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(":::Server running on http://localhost:4000:::");
});
