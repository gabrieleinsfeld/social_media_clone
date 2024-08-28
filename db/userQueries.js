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

const getFollowersById = async (userId) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true, // Include the User who is following
      },
    });

    // Extract the user information from the followers
    return followers.map((follow) => follow.follower);
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Error fetching followers");
  }
};

const getFollowingById = async (userId) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: true, // Include the User who is following
      },
    });

    // Extract the user information from the followers
    return followers.map((follow) => follow.following);
  } catch (error) {
    console.error("Error fetching following:", error);
    throw new Error("Error fetching following");
  }
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: { followers: true, following: true },
  });
  return users;
};

const startFollowing = async (userId, id) => {
  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      throw new Error("Already following this user");
    }
    const follow = await prisma.follow.create({
      data: {
        followerId: id,
        followingId: userId,
      },
    });

    return follow;
  } catch (error) {
    throw new Error(error);
  }
};

const createNewUser = async (username, email, password) => {
  try {
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    if (!user) {
      throw new Error("User was not created");
    }
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User cannot be deleted because it does not exist");
    } else {
      await prisma.user.delete({ where: { id } });
      return;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const isFollowing = async (followerId, followingId) => {
  try {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    if (follow) {
      return true; // The user is following
    } else {
      return false; // The user is not following
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFollowing = async (followerId, followingId) => {
  try {
    const follow = await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { message: "Unfollowed successfully" };
  } catch (error) {
    throw new Error("Was not able to unfollow");
  }
};

module.exports = {
  getUserById,
  createNewUser,
  getFollowersById,
  getAllUsers,
  startFollowing,
  getFollowingById,
  deleteUser,
  deleteFollowing,
  isFollowing,
};
