const utilities = {};

utilities.parseJSON = (jsonSting) => {
  let output;

  try {
    output = JSON.parse(jsonSting);
  } catch (error) {
    output = {};
    console.log("JSON string to JS Object parse error !");
  }
  return output;
};

module.exports = utilities;
