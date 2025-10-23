import { Request, Response, NextFunction } from "express";
import { failAction, successAction } from "../../../utils/response";
import { AuthRequest } from "../../../types/authRequests";
import ContactUsContent, {
	ISupportCard,
} from "../../../model/ContentManagement/ContactUsContent";
import { validateFields } from "../../../utils/validateFields";
import {
	createContactUsService,
	getContactUsListService,
} from "../../../service/contactUsService";

export const updateContactContent = async (
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

		const updates: Partial<any> = { ...req.body };

		let parsedCards: ISupportCard[] = [];
		if (updates.supportCards) {
			try {
				parsedCards =
					typeof updates.supportCards === "string"
						? JSON.parse(updates.supportCards)
						: updates.supportCards;
			} catch (err) {
				return res.status(400).json({
					success: false,
					message:
						"Invalid format for supportCards. Must be a JSON string or array.",
				});
			}
		}

		const files = req.files as Express.Multer.File[];

		if (files && files.length > 0 && parsedCards) {
			parsedCards = parsedCards.map((card) => {
				const file = files.find((f) => f.fieldname === `icon_${card.type}`);
				if (file) {
					const fullImageUrl = `${req.protocol}://${req.get(
						"host"
					)}/uploads/images/${file.filename}`;
					return { ...card, icon: fullImageUrl };
				}
				return card;
			});
		}

		if (parsedCards.length > 0) {
			updates.supportCards = parsedCards;
		}

		const content = await ContactUsContent.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!content) {
			res.status(404).json(failAction("Content not found", 404));
			return;
		}

		res.json(successAction(content, "Contact content updated successfully"));
	} catch (err: any) {
		next(err.message);
	}
};

// export const updateContactContent = async (
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

// 		const content = await ContactUsContent.findByIdAndUpdate(id, updates, {
// 			new: true,
// 			runValidators: true,
// 		});

// 		if (!content) {
// 			res.status(404).json(failAction("Content not found", 404));
// 			return;
// 		}

// 		res.json(successAction(content, "Contact content updated successfully"));
// 	} catch (err: any) {
// 		next(err);
// 	}
// };

export const getContactContent = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const content = await ContactUsContent.find({});
		if (!content || content.length === 0) {
			res.json(failAction("Content not found", 400));
			return;
		}
		res.json(successAction(content, "Get contact content successfully."));
	} catch (err: any) {
		next(err.message);
	}
};

export const createContactUs = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = [
			"firstName",
			"lastName",
			"email",
			"phone",
			"inquiry",
			"agree",
		];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const { firstName, lastName, email, phone, inquiry, agree, message } =
			req.body;

		// const existingContact = await ContactUs.findOne({
		// 	$or: [{ email }, { phone }],
		// });

		// if (existingContact) {
		// 	res
		// 		.status(403)
		// 		.json(
		// 			failAction(
		// 				"This email or phone already submitted the from our admin team contact you shortly.",
		// 				403
		// 			)
		// 		);
		// 	return;
		// }

		const contactUs = await createContactUsService({
			firstName,
			lastName,
			email: email,
			phone: phone,
			inquiry: inquiry,
			message: message,
			agree: agree,
		});
		res.json(
			successAction(
				contactUs,
				"Application submitted successfully, Our admin team review your application and connect you as soon as possible."
			)
		);
	} catch (error: any) {
		next(error.message);
	}
};

export const getContactUsList = async (
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

		const posts = await getContactUsListService(
			search,
			page,
			limit,
			sortBy,
			sortOrder
		);
		res.json(successAction(posts, "Contact Us List fetched successfully"));
	} catch (err: any) {
		next(err.message);
	}
};
