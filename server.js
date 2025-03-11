const http = require("http");
const app = require("./app");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
app.use(cors);
const server = http.createServer(app);

server.listen(PORT, () =>
  console.log(`The server has started on port ${PORT}.`)
);
