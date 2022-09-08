const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByStatus,
  getUsersByDate,
} = require("../controllers/adminConroller");
const { authAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

//----------------------------------------------------------------------------------------------------------------------

//--------------------ADMIN CRUD ROUTES--------------------
router.post("/createUser", authAdmin("admin"), createUser);
router.get("/getUsers", authAdmin("admin"), getAllUsers);
router.put("/updateUser", authAdmin("admin"), updateUser);
router.delete("/deleteUser", authAdmin("admin"), deleteUser);

//--------------------ADMIN FILTER ROUTES--------------------
router.get("/userStatus", authAdmin("admin"), getUsersByStatus);
router.post("/usersBetweenDates", authAdmin("admin"), getUsersByDate);

//----------------------------------------------------------------------------------------------------------------------

module.exports = router;
