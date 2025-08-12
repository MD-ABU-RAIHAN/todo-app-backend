const fs = require("fs").promises;
const path = require("path");
const decoder = require("node:string_decoder");
const { parseJSON } = require("../utilities/utilities");

const data = {};
data.basedir = path.join(__dirname);

data.write = async (file, newData) => {
  const fileLocation = path.join(data.basedir, `${file}.json`);

  // First >> Read The File
  try {
    let storedDataArr = [];
    const storedData = await fs.readFile(fileLocation, "utf8");

    storedDataArr =
      storedData === "" ? [newData] : parseJSON(storedData).concat(newData);

    // js Object to Json stringify and Write File
    const updatedJsonData = JSON.stringify(storedDataArr);
    await fs.writeFile(fileLocation, updatedJsonData, "utf8");

    console.log("File Written successfully");
    return true;
  } catch (err) {
    console.log("there was a problem in Add Data file !");
    return false;
  }
};

data.read = async (file) => {
  const fileLocation = path.join(data.basedir, `${file}.json`);
  try {
    //Read File and produce valid js object
    const storedData = await fs.readFile(fileLocation, "utf8");
    let storedDataObj = storedData ? parseJSON(storedData) : [];
    return storedDataObj;
  } catch (err) {
    console.log("there was a problem in reading file!");
    return true;
  }
};

data.update = async (file, updateData) => {
  const fileLocation = path.join(data.basedir, `${file}.json`);
  try {
    let storedDataArr = [];
    // Read Data and parse Object array
    const storedData = await fs.readFile(fileLocation, "utf8");
    storedDataArr = parseJSON(storedData);

    // Find the index Which data need to delete

    let index = -1;
    if (updateData["id"]) {
      index = storedDataArr.findIndex((object) => object.id === updateData.id);
    } else {
      index = storedDataArr.findIndex(
        (object) => object.phone === updateData.phone
      );
    }

    // check data is exit or not
    if (index === -1) throw new Error("Data is not found!");

    storedDataArr[index] = { ...storedDataArr[index], ...updateData };
    const updatedJsonData = JSON.stringify(storedDataArr);

    await fs.writeFile(fileLocation, updatedJsonData, "utf8");
    console.log("Data updated Successfully!");
    return storedDataArr[index];
  } catch (error) {
    console.log("Data updated Failed!");
    return false;
  }
};

data.delete = async (file, phone, id = "") => {
  // id use only for todo Delete
  const fileLocation = path.join(data.basedir, `${file}.json`);
  try {
    let storedDataArr = [];
    const storedData = await fs.readFile(fileLocation, "utf8");
    storedDataArr = parseJSON(storedData);

    let index = -1;
    if (id) {
      index = storedDataArr.findIndex(
        (object) => object.id === id && object.phone === phone
      );
    } else {
      index = storedDataArr.findIndex((object) => object.phone === phone);
    }

    if (index === -1) {
      console.log("data is not found for delete!");

      return false;
    }
    // Delete data
    storedDataArr.splice(index, 1);

    const updatedJsonData = JSON.stringify(storedDataArr);

    await fs.writeFile(fileLocation, updatedJsonData, "utf8");

    console.log("Data Delete Successfully!");
    return true;
  } catch (error) {
    console.log("Date Delete Operation Failed!");
    return false;
  }
};

module.exports = data;

// TEST: Call
// (async () => {
//   console.log(await data.read("users"));
// })();

// data.delete("users", 1001);

// data.update("users", {
//   id: 1001,
//   first_name: "MD. ABU RAIHAN",
//   last_name: "Hello",
//   email: "john.smith@example.com",
//   age: 28,
//   gender: "male",
//   address: {
//     street: "123 Main St",
//     city: "New York",
//     state: "NY",
//     zip_code: "10001",
//     country: "USA",
//   },
// });

// validation
