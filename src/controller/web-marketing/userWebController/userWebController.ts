import { validateFields } from "../../../utils/validateFields";
import { NextFunction, Request, Response } from "express";
import { failAction, successAction } from "../../../utils/response";
import LeadDriverRider from "../../../model/ContentManagement/LeadSchema";
import {
	createInvestorService,
	leadDriverService,
	leadRiderService,
} from "../../../service/leadDriverRiderService";
import { generateStrongPassword } from "../../../utils/generateRandomPass";
import { AuthRequest } from "../../../types/authRequests";
import { constants } from "../../../common/constants";

export const createDriver = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = [
			"fullName",
			"email",
			"phoneNumber",
			"language",
			"role",
			"city",
			"driverType",
			"drivingLicenseNumber",
			"confirm",
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

		const {
			fullName,
			email,
			phoneNumber,
			language,
			city,
			role,
			driverType,
			drivingLicenseNumber,
			founderClub,
			daycareProgram,
			guardianCertification,
			confirm,
		} = req.body;

		const existingContact = await LeadDriverRider.findOne({
			email,
			phoneNumber,
			role,
		});

		if (existingContact) {
			return res
				.status(403)
				.json(
					failAction(
						`This email and phone number are already registered under the "${role}" role. Our admin team will contact you shortly.`,
						403
					)
				);
		}

		const getFileUrl = (file?: Express.Multer.File) => {
			if (!file) return "";
			const imagePath = `/uploads/images/${file.filename}`;
			return `${req.protocol}://${req.get("host")}${imagePath}`;
		};

		const drivingLicenseImage = getFileUrl(
			(req.files as any)?.drivingLicenseImage?.[0]
		);
		const trainingCertificate = getFileUrl(
			(req.files as any)?.trainingCertificate?.[0]
		);
		const insurance = getFileUrl((req.files as any)?.insurance?.[0]);
		const vehicleRegistration = getFileUrl(
			(req.files as any)?.vehicleRegistration?.[0]
		);

		if (!drivingLicenseImage || !insurance || !vehicleRegistration) {
			return res.status(400).json({
				status: false,
				message: "All required images must be uploaded.",
			});
		}

		const password = generateStrongPassword();
		console.log("password", password);

		const contactUs = await leadDriverService({
			fullName,
			email,
			role,
			phoneNumber,
			language,
			city,
			driverType,
			drivingLicenseNumber,
			founderClub,
			daycareProgram,
			guardianCertification,
			confirm,
			drivingLicenseImage,
			trainingCertificate,
			insurance,
			vehicleRegistration,
			password,
		});
		res.json(
			successAction(
				contactUs,
				"Application submitted successfully, Our admin team review your application and connect you as soon as possible."
			)
		);
	} catch (error) {
		next(error);
	}
};

export const createRider = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = [
			"fullName",
			"email",
			"phoneNumber",
			"language",
			"role",
			"subscriptionPlan",
			"confirm",
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

		const {
			fullName,
			email,
			phoneNumber,
			language,
			role,
			confirm,
			subscriptionPlan,
		} = req.body;

		const existingContact = await LeadDriverRider.findOne({
			email,
			phoneNumber,
			role,
		});

		if (existingContact) {
			return res
				.status(403)
				.json(
					failAction(
						`This email and phone number are already registered under the "${role}" role. Our admin team will contact you shortly.`,
						403
					)
				);
		}

		const password = generateStrongPassword();
		const contactUs = await leadRiderService({
			fullName,
			email,
			role,
			phoneNumber,
			language,
			subscriptionPlan,
			password,
			confirm,
		});
		res.json(successAction(contactUs, "Application submitted successfully."));
	} catch (error) {
		next(error);
	}
};

export const createInvestorContact = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = [
			"firstName",
			"lastName",
			"email",
			"phone",
			"role",
			"countryResidence",
			"investmentTier",
			"confirm",
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

		const {
			firstName,
			lastName,
			email,
			phone,
			role,
			countryResidence,
			amount,
			investmentTier,
			confirm,
			message,
		} = req.body;

		const existingContact = await LeadDriverRider.findOne({
			email,
			phoneNumber: phone,
			role,
		});

		if (existingContact) {
			return res
				.status(403)
				.json(
					failAction(
						`This email and phone number are already registered under the "${role}" role. Our admin team will contact you shortly.`,
						403
					)
				);
		}

		const password = generateStrongPassword();
		const contactUs = await createInvestorService({
			firstName,
			lastName,
			email: email,
			role: role,
			phoneNumber: phone,
			countryResidence: countryResidence,
			amount: amount,
			investmentTier: investmentTier,
			message: message,
			password,
			confirm: confirm,
		});
		res.json(
			successAction(
				contactUs,
				"Application submitted successfully, Our admin team review your application and connect you as soon as possible."
			)
		);
	} catch (error) {
		next(error);
	}
};

export const getUserProfileDetails = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id, role } = req.user;
		let user: any = null;

		if (role === constants.RIDER) {
			user = await LeadDriverRider.findOne({ id, role }).select(
				"fullName phoneNumber email language subscriptionPlan"
			);
		}

		if (role === constants.DRIVER) {
			user = await LeadDriverRider.findOne({ id, role }).select(
				"fullName phoneNumber email language subscriptionPlan"
			);
		}

		if (role === constants.INVESTOR) {
			user = await LeadDriverRider.findOne({ id, role }).select(
				"fullName phoneNumber email language subscriptionPlan"
			);
		}

		if (!user) {
			return res.status(404).json({
				status: false,
				message: "User not found",
			});
		}

		const userResponse = user;

		res.json(successAction(userResponse, "User data fetched"));
	} catch (err: any) {
		throw err;
	}
};
