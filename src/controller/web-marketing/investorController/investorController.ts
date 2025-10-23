import { Request, Response, NextFunction } from "express";
import { failAction, successAction } from "../../../utils/response";
import { AuthRequest } from "../../../types/authRequests";
import { validateFields } from "../../../utils/validateFields";
import { getInvestorListService } from "../../../service/investorService";
import InvestorPackage, {
	IInvestorPackage,
} from "../../../model/ContentManagement/InvestorPackgae";
import SecurityDisclaimer, {
	ISecurityItem,
} from "../../../model/ContentManagement/InvestorSecurityDesc";
import InvestmentMilestone, {
	IInvestmentMilestone,
	IMilestone,
} from "../../../model/ContentManagement/InvestmentMilestone";

// export const createInvestorContact = async (
// 	req: AuthRequest,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const required = [
// 			"firstName",
// 			"lastName",
// 			"email",
// 			"phone",
// 			"countryResidence",
// 			"investmentTier",
// 			"agree",
// 		];
// 		const validation = validateFields(req.body, required);

// 		if (!validation.valid) {
// 			res.status(400).json({
// 				status: false,
// 				message: "Missing fields",
// 				fields: validation.missingFields,
// 			});
// 			return;
// 		}

// 		const {
// 			firstName,
// 			lastName,
// 			email,
// 			phone,
// 			countryResidence,
// 			amount,
// 			investmentTier,
// 			agree,
// 			message,
// 		} = req.body;

// 		const existingContact = await InvestorContact.findOne({
// 			$or: [{ email }, { phone }],
// 		});

// 		if (existingContact) {
// 			res
// 				.status(403)
// 				.json(
// 					failAction(
// 						"This email or phone already submitted the from our admin team contact you shortly.",
// 						403
// 					)
// 				);
// 			return;
// 		}

// 		const contactUs = await createInvestorService({
// 			firstName,
// 			lastName,
// 			email: email,
// 			phone: phone,
// 			countryResidence: countryResidence,
// 			amount: amount,
// 			investmentTier: investmentTier,
// 			message: message,
// 			agree: agree,
// 		});
// 		res.json(
// 			successAction(
// 				contactUs,
// 				"Application submitted successfully, Our admin team review your application and connect you as soon as possible."
// 			)
// 		);
// 	} catch (error) {
// 		next(error);
// 	}
// };

export const updateInvestorPackage = async (
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

		const investors = await InvestorPackage.findById(req.query.id);
		if (!investors) {
			res.status(404).json(failAction("Data not found", 404));
			return;
		}

		let parsedBenifit = investors.benefits;
		if (req.body.benefits) {
			try {
				parsedBenifit = JSON.parse(req.body.benefits);
			} catch (err) {
				return res.status(400).json({
					success: false,
					message: "Invalid format for benefits array. Must be a JSON string.",
				});
			}
		}

		const updatedFields: Partial<IInvestorPackage> = {
			userId: req.user._id,
			heading: req.body.heading ?? investors.heading,
			title: req.body.heading ?? investors.heading,
			amount: req.body.heading ?? investors.heading,
			subtitle: req.body.heading ?? investors.heading,
			equity: req.body.heading ?? investors.heading,
			roi: req.body.heading ?? investors.heading,
			benefits: parsedBenifit,
		};

		let updateInvestor: any = await InvestorPackage.findByIdAndUpdate(
			req.query.id,
			updatedFields,
			{ new: true }
		);

		res.json(
			successAction(updateInvestor, "Investor package updated successfully")
		);
	} catch (err) {
		next(err);
	}
};

export const updateSecurityDisclaimer = async (
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

		const disclaimer = await SecurityDisclaimer.findById(req.query.id);
		if (!disclaimer) {
			res.status(404).json(failAction("Data not found", 404));
			return;
		}

		let parsedItems: ISecurityItem[] = disclaimer.items;
		if (req.body.items) {
			try {
				parsedItems = JSON.parse(req.body.items);
			} catch (err) {
				return res.status(400).json({
					success: false,
					message: "Invalid format for items array. Must be a JSON string.",
				});
			}
		}

		const files = req.files as Express.Multer.File[];
		if (files && files.length > 0) {
			parsedItems = parsedItems.map((item, index) => {
				if (files[index]) {
					const fullImageUrl = `${req.protocol}://${req.get(
						"host"
					)}/uploads/images/${files[index].filename}`;
					return { ...item, imageUrl: fullImageUrl };
				}
				return item;
			});
		}

		const updatedFields = {
			title: req.body.title ?? disclaimer.title,
			description: req.body.description ?? disclaimer.description,
			items: parsedItems,
		};

		const updatedDisclaimer = await SecurityDisclaimer.findByIdAndUpdate(
			req.query.id,
			updatedFields,
			{ new: true }
		);

		res.json(
			successAction(
				updatedDisclaimer,
				"Security & Disclaimer updated successfully"
			)
		);
	} catch (err) {
		next(err);
	}
};

export const updateInvestmentMilestone = async (
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
		const { milestones } = req.body;
		let parsedMilestones: IMilestone[] = [];
		if (milestones) {
			try {
				parsedMilestones =
					typeof milestones === "string" ? JSON.parse(milestones) : milestones;
			} catch (err) {
				return res.status(400).json({
					success: false,
					message:
						"Invalid format for milestones array. Must be a JSON string or array.",
				});
			}
		}

		const investmentMilestone = await InvestmentMilestone.findById(
			req.query.id
		);
		if (!investmentMilestone) {
			res.status(404).json(failAction("Data not found", 404));
			return;
		}

		const updatedFields: Partial<IInvestmentMilestone> = {
			userId: req.user._id,
			milestones:
				parsedMilestones.length > 0
					? parsedMilestones
					: investmentMilestone.milestones,
		};
		const updated = await InvestmentMilestone.findByIdAndUpdate(
			req.query.id,
			updatedFields,
			{ new: true }
		);

		if (!updated) {
			return res
				.status(404)
				.json({ success: false, message: "Milestone not found" });
		}

		res.status(200).json({
			success: true,
			data: updated,
			message: "Milestone Updated successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const getInvestorList = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || req.user.role !== "admin") {
			res.status(403).json(failAction("Unauthorized", 403));
			return;
		}
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || 10;
		const search = (req.query.search as string) || "";
		const sortBy = (req.query.sortBy as string) || "createdAt";
		const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

		const posts = await getInvestorListService(
			search,
			page,
			limit,
			sortBy,
			sortOrder
		);
		res.json(successAction(posts, "Investor List fetched successfully"));
	} catch (err: any) {
		next(err);
	}
};
