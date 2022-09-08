const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "caaryasecret", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
