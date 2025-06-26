const express = require("express");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const { dbConnection } = require("./config/db");
const { typeError } = require("./middlewares/typeError");

app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dbConnection();

app.use(typeError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
