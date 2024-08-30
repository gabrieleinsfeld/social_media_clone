const prisma = require("./prisma");

const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getPosts = async () => {
  try {
    const post = await prisma.post.findMany({ include: { comments: true } });
    return post;
  } catch (error) {
    throw new Error("Error getting posts:", error);
  }
};

const getPostsById = async (userId) => {
  try {
    const post = await prisma.post.findMany({
      where: { userId },
      include: { comments: true },
    });
    return post;
  } catch (error) {
    throw new Error("Error getting post:", error);
  }
};

const getPostByPostId = async (id) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { comments: true },
    });
    return post;
  } catch (error) {
    throw new Error("Error getting post comment:", error);
  }
};

const createPost = async (image, content, userId) => {
  try {
    const post = await prisma.post.create({
      data: {
        content,
        image,
        userId,
      },
    });
    return post;
  } catch (error) {
    throw new Error("Error creating post:", error);
  }
};

const updatePost = async (id, content) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.userId !== userId) {
      throw new Error("You are not authorized to update this post");
    }
    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
};

const deletePost = async (id, userId) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.userId !== userId) {
      throw new Error("You are not authorized to update this post");
    }
    const updatedPost = await prisma.post.delete({
      where: { id },
    });
    return updatedPost;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getUserById,
  createPost,
  getPosts,
  getPostsById,
  getPostByPostId,
  updatePost,
  deletePost,
};
