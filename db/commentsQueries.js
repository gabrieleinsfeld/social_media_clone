const prisma = require("./prisma");

const getCommentsByPostId = async (postId) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });
    return comments;
  } catch (error) {
    throw new Error("Error creating comment:", error);
  }
};

const createComment = async (content, postId, userId) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
    return comment;
  } catch (error) {
    throw new Error("Error creating comment:", error);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
};
