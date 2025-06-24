const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

router.get("/", CommentController.getAllComments);

// Like a comment
router.post("/:commentId/like", CommentController.likeComment);

module.exports = router;
