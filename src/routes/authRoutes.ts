import { Router } from "express";
import {
	adminLogin,
	forgotPassword,
	resendVerifyUrl,
	resetPassword,
	userWebLogin,
	verifyEmailToken,
} from "../controller/authController";
import { verifyToken } from "../middleware/verifyJWT";
import { getUserProfileDetails } from "../controller/web-marketing/userWebController/userWebController";

const authRouter = Router();
authRouter.post("/admin-login", adminLogin);
authRouter.post("/web-login", userWebLogin);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-verify-email-url", resendVerifyUrl);
authRouter.get("/verify-email", verifyToken, verifyEmailToken);
authRouter.get("/get-user", verifyToken, getUserProfileDetails);

export default authRouter;
