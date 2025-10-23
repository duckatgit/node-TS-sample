import multer, { FileFilterCallback } from "multer";
import path from "path";
import { ensureFolder } from "./ensureFolder";

ensureFolder("./uploads/images");

const imageStorage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, "./uploads/images"),
	filename: (_req, file, cb) => {
		const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${unique}-${file.originalname}`);
	},
});

const imageFilter = (
	_req: Express.Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	const allowed = /jpeg|jpg|png|gif|webp/;
	const ext = path.extname(file.originalname).toLowerCase();
	cb(null, allowed.test(ext));
};

export const uploadImage = multer({
	storage: imageStorage,
	fileFilter: imageFilter,
});
