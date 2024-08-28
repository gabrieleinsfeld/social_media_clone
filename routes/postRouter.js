const { Router } = require("express");
const postRouter = Router();
const db = require("../db/postQueries");
const postFileController = require("../controllers/postFileController");
const multer = require("multer");
const upload = multer({ dest: "../uploads" }); // Temporary storage directory

postRouter.get("/all", async (req, res, next) => {
  try {
    const posts = await db.getPosts();
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const posts = await db.getPostsById(userId);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/find/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await db.getPostByPostId(postId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});
postRouter.post("/", upload.single("newFile"), postFileController.uploadFile);

postRouter.put("/", async (req, res, next) => {
  const { postId, content } = req.body;
  try {
    const post = await db.updatePost(postId, content);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await db.deletePost(postId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

module.exports = postRouter;
