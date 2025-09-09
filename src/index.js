const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3001;
const { dbConnection } = require("./config/db");
const { typeError } = require("./middlewares/typeError");

const swaggerUI = require("swagger-ui-express");
const docs = require("./docs/index");

app.use(cors());

app.use(express.json());

app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(docs));

dbConnection();

app.use(typeError);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
