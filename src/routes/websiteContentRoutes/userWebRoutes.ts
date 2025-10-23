import { Router } from "express";
import {
	createDriver,
	createInvestorContact,
	createRider,
} from "../../controller/web-marketing/userWebController/userWebController";
import { uploadImage } from "../../utils/uploadImages";

const userWebRoutes = Router();

userWebRoutes.post("/create-rider", createRider);

userWebRoutes.post(
	"/create-driver",
	uploadImage.fields([
		{ name: "drivingLicenseImage", maxCount: 1 },
		{ name: "trainingCertificate", maxCount: 1 },
		{ name: "insurance", maxCount: 1 },
		{ name: "vehicleRegistration", maxCount: 1 },
	]),
	createDriver
);
userWebRoutes.post("/create-investor", createInvestorContact);

export default userWebRoutes;
