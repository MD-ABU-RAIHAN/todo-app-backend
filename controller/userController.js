const { error } = require("console");
const data = require("../model/data");
const { setUser, getUser } = require("./auth");
const { notFoundController } = require("./notFoundController");

const controller = {};

controller.userController = async (requestProperties, callback) => {
  // user Registration post
  if (requestProperties.method === "post") {
    controller.post(requestProperties, callback);
  } else if (requestProperties.method === "get") {
    controller.get(requestProperties, callback);
  } else if (requestProperties.method === "patch") {
    controller.patch(requestProperties, callback);
  } else if (requestProperties.method === "delete") {
    controller.delete(requestProperties, callback);
  } else {
    notFoundController(requestProperties, callback);
  }
};

// Delete Method // Delete user
controller.delete = async (requestProperties, callback) => {
  const { isValid, validateData } = getUser(
    requestProperties.headerObject.token
  );
  if (!isValid && !validateData) {
    callback(401, {
      error: "Unauthorized request, Authentication is required",
    });
  } else {
    const phone =
      typeof validateData.phone === "string" &&
      validateData.phone.trim().length === 11
        ? validateData.phone.trim()
        : false;

    if (phone) {
      const deleteRes = await data.delete("users", phone);

      deleteRes
        ? callback(204, { message: "User Deleted Successfully!" })
        : callback(500, {
            error: "User Deleted Failed, There is same problem in Server Side!",
          });
    } else {
      callback(400, { error: "invalid delete request!" });
    }
  }
};

// Patch Method // update data
controller.patch = async (requestProperties, callback) => {
  const { isValid, validateData } = getUser(
    requestProperties.headerObject.token
  );
  if (!isValid && !validateData) {
    callback(401, {
      error: "Unauthorized request, Authentication is required",
    });
  } else {
    const phone =
      typeof validateData.phone === "string" &&
      validateData.phone.trim().length === 11
        ? validateData.phone.trim()
        : false;
    const name =
      typeof requestProperties.body.name === "string" &&
      requestProperties.body.name.trim() !== ""
        ? requestProperties.body.name.trim()
        : false;
    const password =
      typeof requestProperties.body.password === "string" &&
      requestProperties.body.password.trim() !== ""
        ? requestProperties.body.password.trim()
        : false;

    if (phone) {
      let updateData = { phone };

      name ? (updateData = { ...updateData, name }) : updateData;
      password ? (updateData = { ...updateData, password }) : updateData;

      const updateRes = await data.update("users", updateData);
      updateRes
        ? callback(200, updateData)
        : callback(500, { error: "Internal server error for Update Date" });
    } else {
      callback(400, { error: "invalid update request!" });
    }
  }
};

// Get Method / Login or
controller.get = async (requestProperties, callback) => {
  const phone =
    typeof requestProperties.headerObject.phone === "string" &&
    requestProperties.headerObject.phone.trim().length === 11
      ? requestProperties.headerObject.phone.trim()
      : false;
  const password =
    typeof requestProperties.headerObject.password === "string" &&
    requestProperties.headerObject.password.trim() !== ""
      ? requestProperties.headerObject.password.trim()
      : false;

  if (phone && password) {
    const usersData = await data.read("users");

    const userData = usersData.find((user) => user.phone === phone);

    if (userData) {
      if (userData.password === password) {
        //Jwt Token
        const token = setUser({ phone: phone });

        callback(200, { token: token });
      } else {
        callback(400, { error: "Invalid Password!" });
      }
    } else {
      callback(400, { error: "Bad Request - User not found !" });
    }
  } else {
    callback(400, { error: "Bad Request - Invalid data" });
  }
};

// Post Method / Registration
controller.post = async (requestProperties, callback) => {
  const name =
    typeof requestProperties.body.name === "string" &&
    requestProperties.body.name.trim() !== ""
      ? requestProperties.body.name.trim()
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone.trim()
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim() !== ""
      ? requestProperties.body.password.trim()
      : false;

  if (name && phone && password) {
    let newUser = { name, phone, password };

    const usersData = await data.read("users");

    if (!usersData.find((user) => user.phone === phone)) {
      const writeResponse = data.write("users", newUser);
      writeResponse
        ? callback(201, newUser)
        : callback(500, { error: "Internal Server error - register user" });
    } else {
      callback(400, { error: "Bad Request - Invalid request data" });
    }
  } else {
    callback(400, { error: "Bad Request - Invalid data" });
  }
};

module.exports = controller;
