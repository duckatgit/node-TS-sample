import LeadDriverRider, {
	DriverType,
	InvestementTier,
	Subscription,
	UserType,
} from "../model/ContentManagement/LeadSchema";
import { appendToGoogleSheet } from "../utils/googleSheet";
import mailService from "../service/mailer.service";
import {
	AdminDriverEmail,
	AdminInvestorEmail,
	AdminRiderEmail,
	DriverWelcomeMail,
	InvestorWelcomeMail,
	RiderWelcomeMail,
	sendSignupEMailForUser,
} from "../utils/htmlContent";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

if (!process.env.ADMIN_INVESTOR_EMAIL) {
	throw new Error("ADMIN_INVESTOR_EMAIL is not set in environment variables");
}

if (!process.env.FRONTEND_URL) {
	throw new Error("FRONTEND_URL is not set in environment variables");
}

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in environment variables");
}

const adminInvestorEmail = process.env.ADMIN_INVESTOR_EMAIL;
const frontendUrl = process.env.FRONTEND_URL;
const secretKey = process.env.JWT_SECRET;

export const leadDriverService = async (data: {
	fullName: string;
	phoneNumber: string;
	email: string;
	language: string;
	city: string;
	drivingLicenseNumber: string;
	driverType: DriverType;
	role: UserType;
	insurance: string;
	vehicleRegistration: string;
	drivingLicenseImage: string;
	trainingCertificate: string;
	confirm: boolean;
	founderClub: boolean;
	daycareProgram: boolean;
	guardianCertification: boolean;
	password: string;
}) => {
	const LeadDriver = await LeadDriverRider.create(data);
	const excelData = {
		sheetName: "Driver" as "Driver",
		formData: {
			fullName: LeadDriver.fullName,
			phoneNumber: LeadDriver.phoneNumber,
			email: LeadDriver.email,
			language: LeadDriver.language,
			city: LeadDriver.city,
			drivingLicenseNumber: LeadDriver.drivingLicenseNumber,
			driverType: LeadDriver.driverType,
			founderClub: LeadDriver.founderClub ? "Yes" : "NO",
			guardianCertification: LeadDriver.guardianCertification ? "Yes" : "No",
			daycareProgram: LeadDriver.daycareProgram ? "Yes" : "No",
			confirm: LeadDriver.confirm ? "Yes" : "No",
			drivingLicenseImage: LeadDriver.drivingLicenseImage,
			vehicleRegistration: LeadDriver.vehicleRegistration,
			insurance: LeadDriver.insurance,
			trainingCertificate: LeadDriver.trainingCertificate,
		},
	};

	const baseUrl = frontendUrl;
	const token = jwt.sign(
		{
			id: LeadDriver._id,
			email: LeadDriver.email,
			role: LeadDriver.role,
			tokenType: "verify-email",
		},
		secretKey,
		{ expiresIn: "1h" }
	);

	const verificationUrl = baseUrl + `/verify-email?token=${token}`;
	await appendToGoogleSheet(excelData);

	const htmlContent = sendSignupEMailForUser(
		LeadDriver.fullName ? LeadDriver.fullName : "",
		LeadDriver.email,
		data.password,
		verificationUrl
	);
	const welComeEmail = DriverWelcomeMail(
		LeadDriver.fullName ? LeadDriver.fullName : ""
	);

	const adminDriverEmail = AdminDriverEmail(data);

	await mailService.sendMail(
		LeadDriver.email,
		"RÉYA: Luxury Rides for Women, by Women — You’re In",
		welComeEmail,
		true
	);
	await mailService.sendMail(
		LeadDriver.email,
		"Driver Registerd successfully",
		htmlContent,
		true
	);
	await mailService.sendMail(
		"satyamku89@yopmail.com",
		"Driver Form Submitted successfully",
		adminDriverEmail,
		true
	);
	return LeadDriver;
};

export const leadRiderService = async (data: {
	fullName: string;
	phoneNumber: string;
	email: string;
	language: string;
	role: UserType;
	subscriptionPlan: Subscription;
	password: string;
	confirm: boolean;
}) => {
	const LeadDriver = await LeadDriverRider.create(data);
	const excelData = {
		sheetName: "Rider" as "Rider",
		formData: {
			fullName: LeadDriver.fullName,
			phoneNumber: LeadDriver.phoneNumber,
			email: LeadDriver.email,
			language: LeadDriver.language,
			subscriptionPlan: LeadDriver.subscriptionPlan,
		},
	};

	const baseUrl = frontendUrl;
	const token = jwt.sign(
		{
			id: LeadDriver._id,
			email: LeadDriver.email,
			role: LeadDriver.role,
			tokenType: "verify-email",
		},
		secretKey,
		{ expiresIn: "1h" }
	);

	const verificationUrl = baseUrl + `/verify-email?token=${token}`;
	await appendToGoogleSheet(excelData);
	const htmlContent = sendSignupEMailForUser(
		LeadDriver.fullName ? LeadDriver.fullName : "",
		LeadDriver.email,
		data.password,
		verificationUrl
	);
	const riderWelcomeEmail = RiderWelcomeMail(
		LeadDriver.fullName ? LeadDriver.fullName : "",
		LeadDriver.subscriptionPlan
	);

	const riderAdminDetails = AdminRiderEmail(
		LeadDriver.fullName ? LeadDriver.fullName : "",
		LeadDriver.email,
		LeadDriver.phoneNumber,
		LeadDriver.language ? LeadDriver.language : "",
		LeadDriver.subscriptionPlan
	);

	await mailService.sendMail(
		LeadDriver.email,
		"RÉYA: Luxury Rides for Women, by Women — You’re In",
		riderWelcomeEmail,
		true
	);

	await mailService.sendMail(
		LeadDriver.email,
		"Rider Registerd successfully",
		htmlContent,
		true
	);

	await mailService.sendMail(
		"satyamku89@yopmail.com",
		"Rider Form Submitted successfully",
		riderAdminDetails,
		true
	);

	return LeadDriver;
};

export const createInvestorService = async (data: {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	countryResidence: string;
	amount: number;
	role: UserType;
	investmentTier: InvestementTier;
	message?: string;
	password: string;
	confirm: boolean;
}) => {
	const investor = await LeadDriverRider.create(data);
	const excelData = {
		sheetName: "Investor" as "Investor",
		formData: {
			firstName: investor.firstName,
			lastName: investor.lastName,
			email: investor.email,
			phone: investor.phoneNumber,
			countryResidence: investor.countryResidence,
			amount: investor.amount,
			investmentTier: investor.investmentTier,
			message: investor.message,
		},
	};
	await appendToGoogleSheet(excelData);

	const baseUrl = frontendUrl;
	const token = jwt.sign(
		{
			id: investor._id,
			email: investor.email,
			role: investor.role,
			tokenType: "verify-email",
		},
		secretKey,
		{ expiresIn: "1h" }
	);

	const verificationUrl = baseUrl + `/verify-email?token=${token}`;

	const htmlContent = sendSignupEMailForUser(
		investor.firstName ? investor.firstName : "",
		investor.email,
		data.password,
		verificationUrl
	);
	const investorWelcomeEmail = InvestorWelcomeMail(
		investor.firstName ? investor.firstName : ""
	);

	const investorAdminEmail = AdminInvestorEmail(
		investor.firstName ? investor.firstName : "",
		investor.lastName ? investor.lastName : "",
		investor.email,
		investor.phoneNumber,
		investor.amount ? investor.amount : 0,
		investor.countryResidence ? investor.countryResidence : "",
		investor.investmentTier ? investor.investmentTier : "",
		investor.message ? investor.message : ""
	);

	await mailService.sendMail(
		investor.email,
		"Thank you for your interest in RÉYA",
		investorWelcomeEmail,
		true
	);

	await mailService.sendMail(
		investor.email,
		"Rider Registerd successfully",
		htmlContent,
		true
	);
	await mailService.sendMail(
		"satyamku89@yopmail.com",
		// adminInvestorEmail,
		"Investor form details",
		investorAdminEmail,
		true
	);
	return investor;
};
