const router=require("express").Router();
const userController=require("../controllers/userController");
const verifyToken=require("../middleware/verifyToken");

router.post("/follow",verifyToken,userController.followAndUnfollowController);
router.get("/getPostsOfFollowing",verifyToken,userController.getPostsOfFollowing);
router.get("/myPosts",verifyToken,userController.getMyPosts);
router.get("/userPosts",verifyToken,userController.getUsersPosts);
router.get("/deleteMyProfile",verifyToken,userController.deleteMyProfile);
module.exports=router;
