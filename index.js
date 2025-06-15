const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const { dbConnection } = require("./config/config");

app.use(express.json());

dbConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
