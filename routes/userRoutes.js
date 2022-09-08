const express = require("express");
const {
  registerUser,
  loginUser,
  postBlog,
  follow,
} = require("../controllers/userController");
const { protect, userAuth } = require("../middleware/authMiddleware");
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
//The below two routes are for registering and user, as user and admin
router.post("/register", registerUser);
router.post("/login", loginUser);
//The below two routes can only be accessed by an authenticated user
//So we use the protect middleware
router.post("/blog", userAuth("user"), postBlog);
router.put("/blog", userAuth("user"), follow);
//----------------------------------------------------------------------------------------------------------------------

module.exports = router;
