import { Request, Response, NextFunction } from "express";
import { validateFields } from "../utils/validateFields";
import { failAction, successAction } from "../utils/response";
import {
	loginAdminService,
	loginService,
	resendVerifyUrlToken,
} from "../service/authService";
import LeadDriverRider, {
	ILeadDriverRider,
} from "../model/ContentManagement/LeadSchema";
import jwt from "jsonwebtoken";
import { forgotPasswordVerifyUrlContent } from "../utils/htmlContent";
import mailService from "../service/mailer.service";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { AuthRequest } from "../types/authRequests";

dotenv.config();

if (!process.env.FRONTEND_URL) {
	throw new Error("FRONTEND_URL is not set in environment variables");
}

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in environment variables");
}

const frontendUrl = process.env.FRONTEND_URL;

export const adminLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = ["email", "password"];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const { email, password } = req.body;
		const newUser = await loginAdminService({ email, password });
		const userResponse = newUser;

		res.json(successAction(userResponse, "Admin login successfully"));
	} catch (err: any) {
		next(err);
	}
};

export const userWebLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const required = ["email", "password", "role"];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}
		const { email, password, role } = req.body;
		const newUser = await loginService({ email, password, role });
		const userResponse = newUser;

		res.json(successAction(userResponse, "Login successfully"));
	} catch (err: any) {
		res.status(400).json({
			status: false,
			message: err.message || "Something went wrong",
		});
	}
};

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email, role } = req.body;

		if (!email || !role) {
			res.status(400).json(failAction("Email and role are required", 400));
			return;
		}

		if (!["Driver", "Rider", "Investor"].includes(role)) {
			res.status(400).json(failAction("Invalid role", 400));
			return;
		}

		const account = await LeadDriverRider.findOne({
			email,
			role,
		});

		if (!account) {
			res.status(404).json(failAction("Account not found", 404));
			return;
		}

		if (role !== account.role) {
			res.status(404).json(failAction("Invalid role request.", 404));
			return;
		}

		if (!account.isVerified) {
			res
				.status(404)
				.json(failAction("Kindly verify your account first.", 404));
			return;
		}

		const token = jwt.sign(
			{
				email: account.email,
				role: role,
			},
			process.env.JWT_SECRET!,
			{ expiresIn: "30m" }
		);

		await account.save();

		const resetLink = `${frontendUrl}/reset-password?token=${token}&role=${role}`;
		const htmlContent = forgotPasswordVerifyUrlContent(resetLink);
		await mailService.sendMail(email, "Reset your password", htmlContent, true);

		res.json(successAction({ resetLink }, "Password reset email sent"));
	} catch (error) {
		throw error;
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	const required = ["token", "newPassword"];
	const validation = validateFields(req.body, required);

	if (!validation.valid) {
		res.status(400).json({
			status: false,
			message: "Missing fields",
			fields: validation.missingFields,
		});
		return;
	}

	const { token, newPassword } = req.body;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			email: string;
			role: string;
		};

		let account: ILeadDriverRider | null = null;
		console.log(decoded);

		account = await LeadDriverRider.findOne({
			email: decoded.email,
			role: decoded.role,
		});

		if (!account) {
			res.status(404).json(failAction("Account not found", 404));
			return;
		}
		const isSame = await bcrypt.compare(newPassword, account.password);
		if (isSame) {
			res
				.status(400)
				.json(
					failAction("New password cannot be the same as the old password", 400)
				);
			return;
		}

		account.password = newPassword;
		await account.save();

		res.json(successAction(null, "Password reset successful"));
	} catch (err) {
		throw err;
	}
};

export const resendVerifyUrl = async (req: Request, res: Response) => {
	try {
		const required = ["email", "role"];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}
		const { email, role } = req.body;
		await resendVerifyUrlToken({ email, role });
		res.status(200).json({
			status: true,
			message:
				"Please verify your email address by clicking the link we just sent you.",
		});
	} catch (error) {
		res.status(500).json({ status: false, message: "Server error" });
	}
};

export const verifyEmailToken = async (req: AuthRequest, res: Response) => {
	try {
		const { id, email, role, tokenType } = req.user;

		if (tokenType !== "verify-email") {
			res.status(400).json({ status: false, message: "Invalid token type" });
			return;
		}

		let user: any = null;

		user = await LeadDriverRider.findOne({
			_id: id,
			email,
			role,
		});

		if (!user) {
			res.status(404).json({ status: false, message: "User not found" });
			return;
		}

		if (user.isVerified) {
			res.status(200).json({ status: true, message: "Email already verified" });
			return;
		}

		user.isVerified = true;
		await user.save();

		res
			.status(200)
			.json({ status: true, message: "Email verified successfully." });
	} catch (error) {
		res
			.status(400)
			.json({ status: false, message: "Invalid or expired token" });
	}
};
