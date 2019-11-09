require("dotenv").config();
const server = require("./server.js");

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`::: Server listening on http://localhost:${PORT} :::`);
});
