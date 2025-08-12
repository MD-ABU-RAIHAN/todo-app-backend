const jwt = require("jsonwebtoken");
require("dotenv").config();

function setUser(user) {
  return jwt.sign({ phone: user.phone }, process.env.SECRET_KEY);
}

function getUser(token) {
  let isValid = false;
  let validateData = "";
  if (!token) return { isValid, validateData };
  try {
    (isValid = true),
      (validateData = jwt.verify(token, process.env.SECRET_KEY));
  } catch {
    isValid = false;
    validateData = "";
    console.log("not valid user login again!");
  }
  return { isValid, validateData };
}

// let token = setUser({ phone: "01711111111" });

// const { isValid, validateData } = getUser(
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjAxNzExMTExMTExIiwiaWF0IjoxNzU0ODk1MjM4fQ.HjGBS1-OuW3rWyKhaRYmJlZ96vo3UNRODANKuKExNl2"
// );
// console.log(isValid, validateData);

module.exports = { setUser, getUser };
