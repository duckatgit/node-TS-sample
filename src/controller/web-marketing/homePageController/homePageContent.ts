import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../types/authRequests";
import { failAction, successAction } from "../../../utils/response";
import HomePageContent from "../../../model/ContentManagement/homePageContent";
import mongoose from "mongoose";
import HomePageFeature, {
	IFeature,
} from "../../../model/ContentManagement/HomePageFeature";
import { validateFields } from "../../../utils/validateFields";
import HomeCompanyValue, {
	ICompanyValue,
} from "../../../model/ContentManagement/HomeCompanyValues";

export const updateHomePageContent = async (
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
		const required = ["id"];
		const validation = validateFields(req.query, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}
		
		let updates: any = { ...req.body };

		updates.userId = req.user._id;

		if (req.files) {
			const files = req.files as { [fieldname: string]: Express.Multer.File[] };

			if (files.safetyImage && files.safetyImage[0]) {
				const safetyImagePath = `/uploads/images/${files.safetyImage[0].filename}`;
				updates["safetyHighlight.image"] = `${req.protocol}://${req.get(
					"host"
				)}${safetyImagePath}`;
			}

			if (files.luxuryVideo && files.luxuryVideo[0]) {
				const luxuryVideoPath = `/uploads/images/${files.luxuryVideo[0].filename}`;
				updates["LuxuryExperience.video"] = `${req.protocol}://${req.get(
					"host"
				)}${luxuryVideoPath}`;
			}
		}

		const content = await HomePageContent.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!content) {
			return res.status(404).json(failAction("Content not found", 404));
		}

		res.json(successAction(content, "Home Page content updated successfully"));
	} catch (err: any) {
		next(err);
	}
};

export const updateHomeFeature = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || req.user.role !== "admin") {
			res.status(403).json(failAction("Unauthorized", 403));
			return;
		}

		const required = ["id"];
		const validation = validateFields(req.query, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const feature = await HomePageFeature.findById(req.query.id);
		if (!feature) {
			res.status(404).json(failAction("Data not found", 404));
			return;
		}

		let image = "";
		if (req.file) {
			const imagePath = `/uploads/images/${req.file.filename}`;
			const fullImageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
			image = fullImageUrl;
		}

		let parsedFeatures = feature.features;
		if (req.body.features) {
			try {
				parsedFeatures = JSON.parse(req.body.features);
			} catch (err) {
				return res.status(400).json({
					success: false,
					message: "Invalid format for features array. Must be a JSON string.",
				});
			}
		}

		const updatedFields: Partial<IFeature> = {
			userId: req.user._id ?? feature.userId,
			heading: req.body.heading ?? feature.heading,
			title: req.body.title ?? feature.title,
			features: parsedFeatures,
			description: req.body.description ?? feature.description,
			image: image ? image : feature.image,
		};

		let updateMentor: any = await HomePageFeature.findByIdAndUpdate(
			req.query.id,
			updatedFields,
			{ new: true }
		);

		res.json(successAction(updateMentor, "Feature updated successfully"));
	} catch (err) {
		next(err);
	}
};

export const updateHomeCompanyValue = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || req.user.role !== "admin") {
			res.status(403).json(failAction("Unauthorized", 403));
			return;
		}

		const required = ["id"];
		const validation = validateFields(req.query, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const companyValue = await HomeCompanyValue.findById(req.query.id);
		if (!companyValue) {
			res.status(404).json(failAction("Data not found", 404));
			return;
		}

		let image = "";
		if (req.file) {
			const imagePath = `/uploads/images/${req.file.filename}`;
			const fullImageUrl = `${req.protocol}://${req.get("host")}${imagePath}`;
			image = fullImageUrl;
		}

		const updatedFields: Partial<ICompanyValue> = {
			userId: req.user._id ?? companyValue.userId,
			title: req.body.title ?? companyValue.title,
			description: req.body.description ?? companyValue.description,
			image: image ? image : companyValue.image,
		};

		let updateCompanyValue: any = await HomeCompanyValue.findByIdAndUpdate(
			req.query.id,
			updatedFields,
			{ new: true }
		);

		res.json(successAction(updateCompanyValue, "Content updated successfully"));
	} catch (err) {
		next(err);
	}
};

export const getHomePageContent = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const content = await HomePageContent.findOne();
		if (!content) {
			return res.status(404).json(failAction("Content not found", 404));
		}
		res.json(successAction(content, "Get content successfully."));
	} catch (err: any) {
		next(err);
	}
};
