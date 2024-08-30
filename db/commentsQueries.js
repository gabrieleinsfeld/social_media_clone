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

const updateComment = async (id, content, userId) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId !== userId) {
      throw new Error("You are not authorized to update this comment");
    }
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    return updatedComment;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (id, userId) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId !== userId) {
      throw new Error("You are not authorized to update this comment");
    }
    const deletedComment = await prisma.comment.delete({
      where: { id },
    });
    return deletedComment;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
};
