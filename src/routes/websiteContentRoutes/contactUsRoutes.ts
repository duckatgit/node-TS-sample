import { Router } from "express";
import { verifyToken } from "../../middleware/verifyJWT";
import { uploadImage } from "../../utils/uploadImages";
import {
	createContactUs,
	getContactContent,
	getContactUsList,
	updateContactContent,
} from "../../controller/web-marketing/contactUsController/contactUsController";

const contactContentRouter = Router();

contactContentRouter.put(
	"/update-contact-content",
	verifyToken,
	uploadImage.fields([
		{ name: "icon_Email", maxCount: 1 },
		{ name: "icon_Phone", maxCount: 1 },
		{ name: "icon_Chat", maxCount: 1 },
	]),
	updateContactContent
);

contactContentRouter.get("/get-contact-content", getContactContent);
contactContentRouter.post("/create-contact-us", createContactUs);
contactContentRouter.get("/get-contact-List", getContactUsList);

export default contactContentRouter;
