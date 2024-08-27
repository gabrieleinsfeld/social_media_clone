const { Router } = require("express");
const userRouter = Router();
const db = require("../db/queries");

userRouter.get("/", (req, res) => {
  const user = req.user;
  res.json({ user });
});

userRouter.get("/all", async (req, res) => {
  const user = await db.getAllUsers();
  res.json({ user });
});

userRouter.get("/follow/status/:id", async (req, res, next) => {
  const followingId = req.params.id;
  const followerId = req.user.id;
  try {
    const isFollowing = await db.isFollowing(followerId, followingId);
    res.json({ isFollowing });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await db.getUserById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/followers/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await db.getFollowersById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/following/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await db.getFollowingById(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("user", username, email, password);
  try {
    const user = await db.createNewUser(username, email, password);

    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/follow", async (req, res, next) => {
  const { userId } = req.body;
  const { id } = req.user;
  try {
    const newFollowing = await db.startFollowing(userId, id);
    res.json({ newFollowing });
  } catch (error) {
    console.error("Error following user:", error);
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    await db.deleteUser(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/unfollow/:id", async (req, res, next) => {
  const followerId = req.user.id;
  const followingId = req.params.id;
  try {
    const message = await db.deleteFollowing(followerId, followingId);
    res.json({ message });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
