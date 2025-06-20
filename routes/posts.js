const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const { authentication } = require("../middlewares/authentication");

router.post("/create", authentication, PostController.create);
router.get("/", PostController.getAll);
router.put("/id/:_id", authentication, PostController.update);
router.delete("/id/:_id", authentication, PostController.delete);
router.get("/title/:title", PostController.getByTitle);
router.get("/id/:_id", PostController.getById);

// Like a post
// router.put("/likes/:_id", authentication, PostController.like);
router.post("/:postId/like", authentication, PostController.likePost);

// Unlike a post
router.delete("/:postId/like", authentication, PostController.unlikePost);

module.exports = router;
