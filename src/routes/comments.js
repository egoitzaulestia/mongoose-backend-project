const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middlewares/authentication");

router.get("/", CommentController.getAllComments);

router.get("/detailed", authentication, CommentController.getDetailed);

// Like a comment
router.post("/:commentId/like", authentication, CommentController.likeComment);

// Unlike a comment
router.delete(
  "/:commentId/like",
  authentication,
  CommentController.unlikeComment
);

module.exports = router;
