const router=require("express").Router();
const postsController=require("../controllers/postsController");
const verifyToken=require("../middleware/verifyToken");

router.get("/all",verifyToken,postsController.postsController);
router.post("/",verifyToken,postsController.createPost);
router.put("/",verifyToken,postsController.updatePost);
router.post("/like",verifyToken,postsController.likeAndDislikePost);
router.delete("/",verifyToken,postsController.deletePost);


module.exports=router;