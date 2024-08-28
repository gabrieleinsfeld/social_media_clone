const { Router } = require("express");
const commentRouter = Router();
const db = require("../db/commentsQueries");

commentRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const comments = await db.getCommentsByPostId(id);
  res.json({ comments });
});

commentRouter.post("/", async (req, res, next) => {
  const { content, postId } = req.body;
  const userId = req.user.id;
  try {
    const comment = await db.createComment(content, postId, userId);
    res.json(comment);
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
