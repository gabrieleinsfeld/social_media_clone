const { Router } = require("express");
const userRouter = Router();
const db = require("../db/queries");

userRouter.get("/", (req, res) => {
  res.json({ message: "hello" });
});

module.exports = userRouter;
