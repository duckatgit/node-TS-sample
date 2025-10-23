import { Router } from "express";
import {
	getHeaderContent,
	updateHeaderContent,
} from "../../controller/web-marketing/headerContentController/headerContent.controller";
import { verifyToken } from "../../middleware/verifyJWT";
import { uploadImage } from "../../utils/uploadImages";

const headerContentRouter = Router();

headerContentRouter.put(
	"/update-header-content",
	verifyToken,
	uploadImage.single("banner"),
	updateHeaderContent
);
headerContentRouter.get("/get-header-content", getHeaderContent);

export default headerContentRouter;
