const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.get("/confirm/:emailToken", UserController.confirm);

module.exports = router;
