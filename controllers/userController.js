const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//---------------------------------------------------------------------------------------------------------------------

const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).json("Name, email, password and role fields are required");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(500).json({ message: "Failed to create the user" });
  }
};
//----------------------------------------------------------------------------------------------------------------------

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    user.status = "active";
    await user.save();
    console.log(user.status);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json("Invalid email or password");
  }
};
//----------------------------------------------------------------------------------------------------------------------

const postBlog = async (req, res, next) => {
  const { userId, blogContent } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    { blog: blogContent },
    { new: true }
  );
  if (user) {
    res.status(200).json({ message: "Blog posted successfully" });
  } else {
    res.status(500).json({ message: "Failed to post blog" });
  }
};
//----------------------------------------------------------------------------------------------------------------------

const follow = async (req, res, next) => {
  const { userId, followerId } = req.body;

  if (userId === followerId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }
  const user = await User.findByIdAndUpdate(userId, {
    $push: { followers: followerId },
  });

  const follower = await User.findByIdAndUpdate(followerId, {
    $push: { following: userId },
  })
    .populate("following", "-password")
    .populate("followers", "-password");

  if (user && follower) {
    res.status(200).json({ message: "Followed successfully", user });
  } else {
    res.status(500).json({ message: "Failed to follow" });
  }
};
//----------------------------------------------------------------------------------------------------------------------

module.exports = {
  registerUser,
  loginUser,
  postBlog,
  follow,
};
