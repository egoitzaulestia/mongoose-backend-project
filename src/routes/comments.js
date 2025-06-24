const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

router.get("/", CommentController.getAllComments);

module.exports = router;
