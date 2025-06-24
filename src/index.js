const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;
const { dbConnection } = require("./config/db");
const { typeError } = require("./middlewares/typeError");

app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

dbConnection();

app.use(typeError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
