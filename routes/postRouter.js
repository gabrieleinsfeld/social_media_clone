const { Router } = require("express");
const postRouter = Router();
const db = require("../db/postQueries");
const postFileController = require("../controllers/postFileController");
const multer = require("multer");
const upload = multer({ dest: "/temp" }); // Temporary storage directory

postRouter.get("/all", async (req, res, next) => {
  const id = req.user.id;
  try {
    const posts = await db.getPosts(id);
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

postRouter.post("/mock", async (req, res, next) => {
  const { image, content } = req.body;
  const userId = req.user.id;
  try {
    const post = await db.createPost(image, content, userId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

postRouter.put("/", async (req, res, next) => {
  const { postId, content } = req.body;
  const userId = req.user.id;
  try {
    const post = await db.updatePost(postId, content, userId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  try {
    const post = await db.deletePost(postId, userId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
});

module.exports = postRouter;
