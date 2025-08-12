const { StringDecoder } = require("string_decoder");
const url = require("url");

const { parseJSON } = require("../utilities/utilities");
const { userController } = require("./userController");
const { todoController } = require("./todoController");
const { notFoundController } = require("./notFoundController");

const controller = {};

controller.reqResController = (req, res) => {
  // Get Url and parse It
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryObject = parseUrl.query;
  const method = req.method.toLowerCase();
  const headerObject = req.headers;

  const requestProperties = {
    parseUrl,
    path,
    trimmedPath,
    queryObject,
    method,
    headerObject,
  };

  let realData = "";
  const decoder = new StringDecoder();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  // Preflight request handling
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === "options") {
    res.writeHead(204);
    return res.end();
  }

  const route = {
    user: userController,
    todo: todoController,
    notFoundController: notFoundController,
  };
  const routeChosenController = route[trimmedPath]
    ? route[trimmedPath]
    : route.notFoundController;

  req.on("data", (chunk) => {
    realData += decoder.write(chunk);
  });

  req.on("end", () => {
    realData += decoder.end();

    if (realData) requestProperties.body = parseJSON(realData);

    routeChosenController(
      requestProperties,
      (statusCode, responseJsonObject) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-type", "application/json");
        res.writeHead(statusCode);
        res.end(JSON.stringify(responseJsonObject));
      }
    );
  });
};

module.exports = controller;
