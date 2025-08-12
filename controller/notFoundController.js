const controller = {};

controller.notFoundController = (requestProperties, callback) => {
  callback(404, { error: "Not Found - Resource doesn't exist" });
};

module.exports = controller;
