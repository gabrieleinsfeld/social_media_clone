const { Router } = require("express");
const userRouter = Router();
const db = require("../db/queries");

userRouter.get("/", (req, res) => {
  res.json({ user: req.user });
});

module.exports = userRouter;
