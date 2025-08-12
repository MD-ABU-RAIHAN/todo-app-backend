const fs = require("fs");

const reqBody = {
  title: "Go to GYM",
  description: "Please go gym regularly",
};

async function main() {
  const fileDir = "./model/todo.json";
  const result = fs.readFileSync(fileDir).toString();

  if (result === "") {
    fs.writeFileSync(fileDir, JSON.stringify([reqBody]));
  } else {
    const data = JSON.stringify(JSON.parse(result).concat(reqBody));

    fs.writeFileSync(fileDir, data);
  }

  console.log("result >>", result);
}

main();
