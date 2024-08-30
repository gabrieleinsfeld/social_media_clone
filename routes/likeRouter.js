const { Router } = require("express");
const likeRouter = Router();
const db = require("../db/likeQueries");

likeRouter.get("/post/:id", async (req, res) => {
  const id = req.params.id;
  const likes = await db.getLikesByPostId(id);
  res.json({ likes });
});

likeRouter.get("/status/:postId", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  const liked = await db.hasUserLikedPost(userId, postId);
  res.json({ liked });
});

likeRouter.get("/users/:postId", async (req, res) => {
  const postId = req.params.postId;
  const users = await db.getUsersWhoLikedPost(postId);
  res.json({ users });
});

likeRouter.post("/", async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.user.id;
  try {
    const like = await db.createLike(postId, userId);
    res.json(like);
  } catch (error) {
    next(error);
  }
});

likeRouter.delete("/:likeId", async (req, res, next) => {
  const likeId = req.params.likeId;
  const userId = req.user.id;
  try {
    const like = await db.deleteLike(likeId, userId);
    res.json({ like });
  } catch (error) {
    next(error);
  }
});

module.exports = likeRouter;
