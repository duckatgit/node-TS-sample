import { Router } from "express";
import { verifyToken } from "../../middleware/verifyJWT";
import { uploadImage } from "../../utils/uploadImages";
import {
	getAboutUsContent,
	updateAboutUsContent,
} from "../../controller/web-marketing/aboutUsController/aboutUsContent";

const aboutContentRouter = Router();

aboutContentRouter.put(
	"/update-aboutus-content",
	verifyToken,
	uploadImage.fields([
		{ name: "founderImage", maxCount: 1 },
		{ name: "missionImage", maxCount: 1 },
		{ name: "visionImage", maxCount: 1 },
		{ name: "promiseIcons", maxCount: 10 },
	]),
	updateAboutUsContent
);

aboutContentRouter.get("/get-about-content", getAboutUsContent);

export default aboutContentRouter;
