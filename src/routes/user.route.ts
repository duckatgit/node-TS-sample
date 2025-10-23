import express from 'express';
import { userVerificationFields, vehicleImageFields } from '../common/constants';
import userController from '../controller/userController';
import upload from "../middleware/uploadFile";
import { verifyToken } from '../middleware/verifyJWT';

const userRouter = express.Router();

// Register of User
userRouter.post("/register", userController.registerDriver);
userRouter.post("/verifyUser", upload.fields(userVerificationFields),userController.verifyUser);
userRouter.post("/saveVehicleInfo", upload.fields(vehicleImageFields), userController.saveVehicleInfo);
userRouter.post("/saveUserBank", userController.saveUserBankingDetails);
userRouter.post("/fetchStageData", userController.fetchUserStageWiseDetails);
userRouter.get("/fetchUserDetails/:id", userController.fetchUserDetails);
userRouter.post("/submitDetails", userController.submitDetails);

// SignIn
userRouter.post("/signin", userController.signInUser);

// Forgot & Reset Password
userRouter.post("/forgotPassword", userController.forgotPassword);
userRouter.post("/resendOtp", userController.resendOTP);
userRouter.post("/verifyOTP", userController.verifyOTP);
userRouter.post("/resetPassword", verifyToken, userController.resetPassword);


export default userRouter;

