import { Request, Response, NextFunction } from "express";
import { failAction, successAction } from "../../../utils/response";
import { AuthRequest } from "../../../types/authRequests";
import HeaderContent from "../../../model/ContentManagement/HeaderContent";

export const updateHeaderContent = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || req.user.role !== "admin") {
			res
				.status(403)
				.json(failAction("Unauthorized: Only admins can update content", 403));
			return;
		}
		const { id } = req.query;
		const updates = req.body;

		if (req.file) {
			const imagePath = `/uploads/images/${req.file.filename}`;
			const fullImageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
			updates.banner = fullImageUrl;
		}

		const content = await HeaderContent.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!content) {
			res.status(404).json(failAction("Content not found", 404));
			return;
		}
		res.json(successAction(content, "Content updated successfully"));
	} catch (err: any) {
		throw err;
	}
};

export const getHeaderContent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const content = await HeaderContent.find({});
		if (!content) {
			res.json(failAction("Content not found", 400));
			return;
		}
		res.json(successAction(content, "Get Content Successfully."));
	} catch (err: any) {
		throw err;
	}
};
