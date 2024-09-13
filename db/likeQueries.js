const prisma = require("./prisma");

const getLikesByPostId = async (id) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        likes: true,
      },
    });
    return post.likes;
  } catch (error) {
    throw new Error(error);
  }
};

const createLike = async (postId, userId) => {
  try {
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return like;
  } catch (error) {
    throw new Error(error);
  }
};

const getUsersWhoLikedPost = async (postId) => {
  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: true, // Include the user relation to get user details
      },
    });

    // Extract the users from the likes
    const users = likes.map((like) => like.user);

    return users;
  } catch (error) {
    throw new Error(`Error getting users who liked post: ${error.message}`);
  }
};

const deleteLike = async (postId, userId) => {
  try {
    const like = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (!like) {
      throw new Error("Like not found");
    }

    // Delete the like
    const deletedLike = await prisma.like.delete({
      where: {
        id: like.id, // Delete by the like's id
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

const hasUserLikedPost = async (userId, postId) => {
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return !!like;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getLikesByPostId,
  createLike,
  deleteLike,
  hasUserLikedPost,
  getUsersWhoLikedPost,
};
