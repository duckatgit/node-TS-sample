import { Request, Response, NextFunction } from "express";
import { failAction, successAction } from "../../../utils/response";
import { AuthRequest } from "../../../types/authRequests";
import AboutUs from "../../../model/ContentManagement/AboutUsContent";

// export const updateAboutUsContent = async (
// 	req: AuthRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		if (!req.user || req.user.role !== "admin") {
// 			res
// 				.status(403)
// 				.json(failAction("Unauthorized: Only admins can update content", 403));
// 			return;
// 		}

// 		const { id } = req.query;
// 		const updates = req.body;

// 		if (req.file) {
// 			const imagePath = `/uploads/images/${req.file.filename}`;
// 			const fullImageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
// 			updates.icon = fullImageUrl;
// 		}

// 		const content = await AboutUs.findByIdAndUpdate(id, updates, {
// 			new: true,
// 			runValidators: true,
// 		});

// 		if (!content) {
// 			res.status(404).json(failAction("Content not found", 404));
// 			return;
// 		}

// 		res.json(successAction(content, "About US content updated successfully"));
// 	} catch (err: any) {
// 		next(err);
// 	}
// };

export const updateAboutUsContent = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || req.user.role !== "admin") {
			return res
				.status(403)
				.json(failAction("Unauthorized: Only admins can update content", 403));
		}

		const { id } = req.query;
		let updates = { ...req.body };

		/**
		 * Handle multiple image uploads
		 * Example: req.files = {
		 *   founderImage: [File],
		 *   missionImage: [File],
		 *   visionImage: [File],
		 *   promiseIcons: [File, File, File]
		 * }
		 */
		if (req.files) {
			const files = req.files as {
				[fieldname: string]: Express.Multer.File[];
			};

			if (files.founderImage && files.founderImage[0]) {
				const founderPath = `/uploads/images/${files.founderImage[0].filename}`;
				updates["founder.image"] = `${req.protocol}://${req.get(
					"host"
				)}${founderPath}`;
			}

			if (files.missionImage && files.missionImage[0]) {
				const missionPath = `/uploads/images/${files.missionImage[0].filename}`;
				updates["missionVision.mission.image"] = `${req.protocol}://${req.get(
					"host"
				)}${missionPath}`;
			}

			if (files.visionImage && files.visionImage[0]) {
				const visionPath = `/uploads/images/${files.visionImage[0].filename}`;
				updates["missionVision.vision.image"] = `${req.protocol}://${req.get(
					"host"
				)}${visionPath}`;
			}

			if (files.promiseIcons) {
				files.promiseIcons.forEach((file, index) => {
					const iconPath = `/uploads/images/${file.filename}`;
					updates[`promise.items.${index}.icon`] = `${req.protocol}://${req.get(
						"host"
					)}${iconPath}`;
				});
			}
		}

		const content = await AboutUs.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!content) {
			return res.status(404).json(failAction("Content not found", 404));
		}

		res.json(successAction(content, "About Us content updated successfully"));
	} catch (err: any) {
		next(err);
	}
};

export const getAboutUsContent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const content = await AboutUs.findOne();
		if (!content) {
			return res.status(404).json(failAction("Content not found", 404));
		}
		res.json(successAction(content, "Get content successfully."));
	} catch (err: any) {
		next(err);
	}
};
