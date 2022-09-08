const express = require("express");
const User = require("../models/userModel");

//---------------------------------ADMIN ROUTES----------------------------------
//----------------------------------------------------------------------------------------------------------------------

//---------------------------------CREATE A USER----------------------------------
const createUser = (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password, role: "user" });
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(200).json({ user });
  });
};
//----------------------------------------------------------------------------------------------------------------------

//---------------------------------GET ALL USERS----------------------------------
const getAllUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(400).json({ error: "No users found" });
    }
    res.status(200).json({ users });
  });
};
//----------------------------------------------------------------------------------------------------------------------

//---------------------------------UPDATE USER----------------------------------
const updateUser = async (req, res) => {
  const { userId, role, password } = req.body;

  const user = await User.findById(userId);
  if (user && user.role === "admin") {
    return res.status(400).json({ error: "You cannot update an admin" });
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: role, password: password },
    { new: true }
  );
  if (updateUser) {
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } else {
    res.status(500).json({ message: "Failed to update user" });
  }
};
//----------------------------------------------------------------------------------------------------------------------

//----------------------------DELETE USER---------------------------------------
const deleteUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (user && user.role === "admin") {
    return res.status(400).json({ error: "You cannot delete an admin" });
  }
  User.findByIdAndDelete(userId, (err, user) => {
    if (err) {
      return res.status(400).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: `${user.name} deleted successfully`, user });
  });
};

//----------------------------------------------------------------------------------------------------------------------

//ROUTE FOR GETTING USERS BY STATUS (ACTIVE OR INACTIVE)

const getUsersByStatus = async (req, res, next) => {
  const activeUsers = await User.find({ status: "active" });
  const inactiveUsers = await User.find({ status: "inactive" });
  if (activeUsers && inactiveUsers) {
    res.status(200).json({ activeUsers, inactiveUsers });
  } else {
    res.status(500).json({ message: "Failed to get users" });
  }
};

//----------------------------------------------------------------------------------------------------------------------

//ROUTE TO GET USERS CREATED BETWEEN TWO DATES
const getUsersByDate = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const usersBetweenDateRange = await User.find({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const lastWeekUsers = await User.find({
    timestamp: {
      $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
    },
  });
  const lastMonthUsers = await User.find({
    createdAt: {
      $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000),
    },
  });
  if (usersBetweenDateRange && lastWeekUsers && lastMonthUsers) {
    res
      .status(200)
      .json({ usersBetweenDateRange, lastWeekUsers, lastMonthUsers });
  } else {
    res.status(500).json({ message: "Failed to get users" });
  }
};

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByStatus,
  getUsersByDate,
};

//----------------------------------------------------------------------------------------------------------------------
