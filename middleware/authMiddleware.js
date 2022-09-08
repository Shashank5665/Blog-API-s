const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, "caaryasecret");

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
};

const authAdmin = (role) => async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, "caaryasecret");

      req.user = await User.findById(decoded.id).select("-password");
      if (req.user.role === role) {
        next();
      } else {
        res.status(401).json("You do not have permission to access this page");
      }
    } catch (error) {
      res.status(401).json("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
};

const userAuth = (role) => async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, "caaryasecret");

      req.user = await User.findById(decoded.id).select("-password");
      if (req.user.role === role) {
        next();
      } else {
        res.status(401).json("You are an admin, you cannot access user's page");
      }
    } catch (error) {
      res.status(401).json("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
};

module.exports = { protect, authAdmin, userAuth };
