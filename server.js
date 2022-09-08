const express = require("express");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db.js");

connectDB();
const app = express();
app.use(express.json());
const port = 9000;

//----------------------------------------------------------------------------------------------------------------------

//MIDDLEWARES
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

//----------------------------------------------------------------------------------------------------------------------

app.listen(9000, () => console.log(`Server started on port ${port}`));
