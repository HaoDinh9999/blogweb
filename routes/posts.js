const User = require("../models/User");
const Post = require("../models/Post");
const postController = require("../controller/postController.js");
const express = require("express");

const router = express.Router({ mergeParams: true });
router.route("/top-writer-post").get(postController.getTopWriter);

router
  .route("/")
  .post(postController.createPost)
  .get(postController.getAllPost);
router
  .route("/:id")
  .put(postController.updatePost)
  .delete(postController.deletePost)
  .get(postController.getPost);
router.route("/getMonthlyPlan/:year").get(postController.getPostPerMonthOfYear);

module.exports = router;
