const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { single } = require("../middlewares/uploads");

const { authentication, isAdmin } = require("../middlewares/authentication");

// router.post("/register", UserController.register);
router.post("/register", single("phot"), UserController.register);

router.get("/confirm/:emailToken", UserController.confirm);
router.post("/login", UserController.login);
router.delete("/logout", authentication, UserController.logout);
router.get("/info", authentication, UserController.getInfo);
router.get("/id/:_id", authentication, UserController.getById);
router.get("/name/:name", UserController.getByName);
router.get("/", UserController.getAll);

router.put("/id/:_id", authentication, UserController.update);

// Upload profile-photo endpoint
router.post(
  "/me/photo",
  authentication,
  single("photo", UserController.uploadPhoto)
);

router.delete("/id/:_id", authentication, UserController.delete);

router.get("/me/profile", authentication, UserController.getProfile);

// follow / unfollow
router.post("/:id/follow", authentication, UserController.follow);
router.delete("/:id/follow", authentication, UserController.unfollow);

module.exports = router;
