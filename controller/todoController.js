const data = require("../model/data");
const { getUser } = require("./auth");

const controller = {};

/**
 *
 * @param {Request} requestProperties
 * @param {Response} callback
 */
controller.todoController = (requestProperties, callback) => {
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

// Post Method / add TODO
controller.post = async (requestProperties, callback) => {
  const { isValid, validateData } = getUser(
    requestProperties.headerObject.token
  );
  if (!isValid && !validateData) {
    callback(401, {
      error: "Unauthorized request, Authentication is required",
    });
  } else {
    const id =
      typeof requestProperties.body.id === "string" &&
      requestProperties.body.id.trim() !== ""
        ? requestProperties.body.id.trim()
        : false;
    const title =
      typeof requestProperties.body.title === "string" &&
      requestProperties.body.title.trim() !== ""
        ? requestProperties.body.title.trim()
        : false;
    const phone =
      typeof validateData.phone === "string" &&
      validateData.phone.trim().length === 11
        ? validateData.phone.trim()
        : false;

    const description =
      typeof requestProperties.body.description === "string" &&
      requestProperties.body.description.trim() !== ""
        ? requestProperties.body.description.trim()
        : false;
    const isComplete =
      typeof requestProperties.body.isComplete === "boolean" &&
      requestProperties.body.isComplete !== ""
        ? requestProperties.body.isComplete
        : false;
    const date =
      typeof requestProperties.body.date === "string" &&
      requestProperties.body.date !== ""
        ? requestProperties.body.date
        : false;
    const category =
      typeof requestProperties.body.category === "string" &&
      requestProperties.body.category !== ""
        ? requestProperties.body.category
        : false;

    if (id && title && phone && description && date && category) {
      let newTodo = {
        id,
        title,
        description,
        date,
        category,
        isComplete,
        phone,
      };

      const writeResponse = data.write("todos", newTodo);
      writeResponse
        ? callback(201, newTodo)
        : callback(500, { error: "Internal Server error - Todo Add" });
    } else {
      callback(400, { error: "Bad Request - Invalid todo data" });
    }
  }
};

// Get Method / Login or
controller.get = async (requestProperties, callback) => {
  const { isValid, validateData } = getUser(
    !!requestProperties.headerObject.token
      ? requestProperties.headerObject.token
      : false
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
      const todosData = await data.read("todos");

      const userTodos =
        todosData.length !== 0
          ? todosData.filter((todo) => todo.phone === phone)
          : { message: "Bad Request - No todo Available" };

      const statusCode = Array.isArray(userTodos) ? 200 : 404;

      callback(statusCode, userTodos);
    } else {
      callback(400, { error: "Bad Request - No todo Available" });
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
    const id =
      typeof requestProperties.body.id === "string" &&
      requestProperties.body.id.trim() !== ""
        ? requestProperties.body.id.trim()
        : false;
    const title =
      typeof requestProperties.body.title === "string" &&
      requestProperties.body.title.trim() !== ""
        ? requestProperties.body.title.trim()
        : false;
    const description =
      typeof requestProperties.body.description === "string" &&
      requestProperties.body.description.trim() !== ""
        ? requestProperties.body.description.trim()
        : false;
    const isComplete =
      typeof requestProperties.body.isComplete === "boolean" &&
      requestProperties.body.isComplete !== ""
        ? requestProperties.body.isComplete
        : false;

    const date =
      typeof requestProperties.body.date === "string" &&
      requestProperties.body.date !== ""
        ? requestProperties.body.date
        : false;
    const category =
      typeof requestProperties.body.category === "string" &&
      requestProperties.body.category !== ""
        ? requestProperties.body.category
        : false;

    if (phone && id) {
      let updateData = { id, phone, isComplete };

      title ? (updateData = { ...updateData, title }) : updateData;
      description ? (updateData = { ...updateData, description }) : updateData;
      date ? (updateData = { ...updateData, date }) : updateData;
      category ? (updateData = { ...updateData, category }) : updateData;

      const updateRes = await data.update("todos", updateData);
      updateRes
        ? callback(200, updateData)
        : callback(500, { error: "Internal server error for Update TODO" });
    } else {
      callback(400, { error: "invalid TODO update request!" });
    }
  }
};

// Delete Method // Delete Todo
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

    const id =
      typeof requestProperties.body.id === "string" &&
      requestProperties.body.id.trim() !== ""
        ? requestProperties.body.id.trim()
        : false;

    if (phone && id) {
      const deleteRes = await data.delete("todos", phone, id);

      deleteRes
        ? callback(201, { message: "User ToDo Deleted Successfully!" })
        : callback(404, {
            error:
              "TODO Deleted Failed, There is same problem in your Request!",
          });
    } else {
      callback(400, { error: "invalid todo delete request!" });
    }
  }
};

module.exports = controller;
