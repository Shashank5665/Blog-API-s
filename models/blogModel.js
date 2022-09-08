const mongoose = require("mongoose");
const blogModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Blog = mongoose.model("Blog", blogModel);
module.exports = Blog;
