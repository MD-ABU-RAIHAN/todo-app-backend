const http = require("http");
require("dotenv").config();
const { reqResController } = require("./controller/reqResController");

const app = {};

app.createServer = () => {
  const server = http.createServer(reqResController);

  server.listen(process.env.PORT, () => {
    console.log("Server is Listening on Post >>", process.env.PORT);
  });
};

app.createServer();
