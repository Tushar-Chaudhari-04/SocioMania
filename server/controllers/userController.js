const User = require("../models/User");
const Post = require("../models/Post");
const { success, error } = require("../utils/responseWrapper");

const followAndUnfollowController = async (req, res) => {
  const { userToFollowId } = req.body;
  const currentUserId = req._id;
  console.log("id", userToFollowId, currentUserId);
  try {
    const userToFollowData = await User.findById(userToFollowId);
    const currentUserData = await User.findById(currentUserId);
    console.log("User Data", userToFollowData, currentUserData);

    if (userToFollowId === currentUserId) {
      return res.send(error(409, "Cannot follow/unfollow yourself... :)"));
    }

    if (!userToFollowData) {
      return res.send(error(500, "User to follow not found..."));
    }

    if (currentUserData.following.includes(userToFollowId)) {
      const followingIndex = currentUserData.following.indexOf(userToFollowId);
      currentUserData.following.splice(followingIndex, 1);

      const followerIndex = userToFollowData.followers.indexOf(currentUserId);
      userToFollowData.followers.splice(followerIndex, 1);

      await currentUserData.save();
      await userToFollowData.save();

      return res.send(success(200, "User is Unfollowed"));
    } else {
      currentUserData.following.push(userToFollowId);
      userToFollowData.followers.push(currentUserId);
      await currentUserData.save();
      await userToFollowData.save();

      return res.send(success(200, "User is followed"));
    }
  } catch (err) {
    res.send(500, err.message);
  }
};

const getPostsOfFollowing = async (req, res) => {
  const currentUserId = req._id;
  console.log("id", currentUserId);
  try {
    const currentUserData = await User.findById(currentUserId);
    console.log("User Data", currentUserData);

    const posts = await Post.find({
      owner: {
        $in: currentUserData.following,
      },
    });

    return res.send(200, posts);
  } catch (err) {
    res.send(500, err.message);
  }
};

const getMyPosts = async (req, res) => {
  const currentUserId = req._id;
  try {
    const posts = await Post.find({ owner: currentUserId });

    if (!posts) {
      res.send(error(404, "Posts Not Found..."));
    }

    res.send(success(200, posts));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const getUsersPosts = async (req, res) => {
  const { currentUserId } = req.body;
  try {
    const posts = await Post.find({ owner: currentUserId })
    .populate("likes");

    if (!posts) {
      res.send(error(404, "Posts Not Found..."));
    }

    res.send(success(200, posts));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

const deleteMyProfile = async (req, res) => {
  const currentUserId = req._id;
  try {
    const userData = await User.findById(currentUserId);

    if (!userData) {
      res.send(error(404, "User Not Found.Please provide valid User..."));
    }

    const followingData = await User.find({
      following: currentUserId,
    });

    const followersData = await User.find({
      followers: currentUserId,
    });

    for (var i = 0; i < followingData.length; i++) {
      const followingIndex = followingData[i].following.indexOf(currentUserId);
      followingData[i].following.splice(followingIndex, 1);
      await followingData[i].save();
    }

    for (var i = 0; i < followersData.length; i++) {
      const followersIndex = followersData[i].followers.indexOf(currentUserId);
      followersData[i].followers.splice(followersIndex, 1);
      await followersData[i].save();
    }

    await userData.deleteOne();
    res.send(success(200, "User deleted Successfully"));
  } catch (err) {
    res.send(error(500, err.message));
  }
};

module.exports = {
  followAndUnfollowController,
  getPostsOfFollowing,
  getMyPosts,
  getUsersPosts,
  deleteMyProfile, //.....Delete user data,its data from following/followers data
};
