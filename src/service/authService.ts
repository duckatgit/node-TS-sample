import jwt from "jsonwebtoken";
import User from "../model/user.model";
import { constants } from "../common/constants";
import LeadDriverRider from "../model/ContentManagement/LeadSchema";

import dotenv from "dotenv";
import { emailVerifyUrlContent } from "../utils/htmlContent";
import mailService from "../service/mailer.service";

dotenv.config();

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in environment variables");
}

if (!process.env.FRONTEND_URL) {
	throw new Error("FRONTEND_URL is not set in environment variables");
}

const jwtSecret = process.env.JWT_SECRET;
const frontendUrl = process.env.FRONTEND_URL;

export const loginAdminService = async (loginData: {
	email: string;
	password: string;
}) => {
	try {
		const { email, password } = loginData;
		const user = await User.findOne({ email: email, isDeleted: false }).select(
			"+password"
		);

		if (!user) {
			throw new Error("User not found");
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			throw new Error("Invalid credentials");
		}

		if (user.role !== constants.ADMIN) {
			throw new Error("Only admin can access this route.");
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token,
			createdAt: user.createdAt,
		};
	} catch (error) {
		throw error;
	}
};

export const loginService = async (loginData: {
	email: string;
	password: string;
	role: string;
}) => {
	try {
		const { email, password, role } = loginData;
		const user = await LeadDriverRider.findOne({
			email: email,
			role: role,
			isDeleted: false,
		}).select("+password");

		if (!user) {
			throw new Error("User not found");
		}
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			throw new Error("Invalid credentials");
		}

		if (!user.isVerified) {
			throw new Error("User not verified.");
		}

		// Generate JWT
		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		return {
			_id: user._id,
			fullName: user.fullName ? user.fullName : user.firstName,
			email: user.email,
			role: user.role,
			token,
			createdAt: user.createdAt,
		};
	} catch (error) {
		throw error;
	}
};

export const resendVerifyUrlToken = async (data: {
	email: string;
	role: string;
}) => {
	try {
		const { email, role } = data;
		let user: any = null;

		user = await LeadDriverRider.findOne({
			email: email,
			role: role,
		});

		if (!user) {
			throw new Error("User not exist.");
		}

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				role: user.role,
				tokenType: "verify-email",
			},
			jwtSecret,
			{ expiresIn: "1h" }
		);

		const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
		const htmlContent = emailVerifyUrlContent(verificationUrl);

		await mailService.sendMail(
			email,
			"Email Verification Link",
			htmlContent,
			true
		);
	} catch (error) {
		throw error;
	}
};
