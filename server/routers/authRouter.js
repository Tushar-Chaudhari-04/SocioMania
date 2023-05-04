//Auth Router Section -->  (MVC)

const router=require("express").Router();
const authRouter=require("../controllers/authController");

router.post("/signup",authRouter.signupController);
router.post("/login",authRouter.loginController);
router.post("/refresh",authRouter.refreshAccessTokenController);
router.post("/logout",authRouter.logoutController);
module.exports=router;
