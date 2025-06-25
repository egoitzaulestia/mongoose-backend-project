const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middlewares/authentication");
const { isCommentAuthor } = require("../middlewares/authorship");

router.get("/", CommentController.getAllComments);

router.get("/detailed", authentication, CommentController.getDetailed);
router.get(
  "/:commentId/detailed",
  authentication,
  CommentController.getOneDetailed
);

// Like a comment
router.post("/:commentId/like", authentication, CommentController.likeComment);

// Unlike a comment
router.delete(
  "/:commentId/like",
  authentication,
  CommentController.unlikeComment
);

// Edit comment, guarded by isCommentAuthor
router.put(
  "/:commentId",
  authentication,
  isCommentAuthor,
  CommentController.updateComment
);

// Delete comment, guarded by isCommentAuthor
router.delete(
  "/:commentId",
  authentication,
  isCommentAuthor,
  CommentController.deleteComment
);

module.exports = router;
