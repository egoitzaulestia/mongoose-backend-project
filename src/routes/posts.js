const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const CommentController = require("../controllers/CommentController");
const { authentication } = require("../middlewares/authentication");

router.post("/create", authentication, PostController.create);
router.get("/", PostController.getAll);
router.get("/full", PostController.getAllWithCommonts);
// router.get("/full", authentication, PostController.getAllWithCommonts);
router.put("/id/:_id", authentication, PostController.update);
router.delete("/id/:_id", authentication, PostController.delete);
router.get("/title/:title", PostController.getByTitle);
router.get("/id/:_id", PostController.getById);

// Like a post
router.post("/:postId/like", authentication, PostController.likePost);

// Unlike a post
router.delete("/:postId/like", authentication, PostController.unlikePost);

// Create a comment in post
router.post("/:postId/comments", authentication, CommentController.create);

// GET all comments from a post
router.get(
  "/:postId/comments",
  authentication,
  CommentController.getAllComments
);

module.exports = router;
