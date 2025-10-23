import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import environment from "../config/environment";
import logger from "../service/logger";
import { constants } from "./constants";
import fs from 'fs/promises';
import fileSystem from 'fs';
import path from 'path';


const SALT_ROUNDS = 10;
const JWT_SECRET = environment.JWT_SECRET as string;
const JWT_EXPIRE_TIME = (environment.JWC_EXPIRE_TIME as string) || "1h";

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is not defined");
}

// ---------------------- UTILITY FUNCTIONS ----------------------

function isBlank(stringValue: string | null | undefined): boolean {
	return (
		stringValue === constants.BLANK ||
		stringValue === null ||
		stringValue === undefined
	);
}

function createResponse<T = any>(
	responseCode: number,
	responseMsg: string,
	data: T = {} as T
) {
	const response = { responseCode, responseMsg, data };
	logger.info(response);
	return response;
}

function sendSuccessResponse(res: Response, statusCode: number, message: string, data:any = {} ): void {
	res.status(statusCode).json({
		status: 1,
		message: message || 'Success',
		data: data || undefined,
	});
}

function sendFailedResponse(res: Response, statusCode: number, message: string, data:any = {} ): void {
	res.status(statusCode).json({
		status: 0,
		message: message || 'Failed',
		data: data || undefined,
	});
}

async function deleteFileIfExists(folderPath: string) {
	try {
		const fullPath = path.resolve(folderPath);

		// Check if folder exists
		await fs.access(fullPath);

		// Read all entries in the folder
		const files = await fs.readdir(fullPath);

		// Remove all files/directories inside
		for (const file of files) {
			const currentPath = path.join(fullPath, file);
			const stat = await fs.lstat(currentPath);

			if (stat.isDirectory()) {
				// Recursively remove subfolder
				await fs.rm(currentPath, { recursive: true, force: true });
			} else {
				// Remove file
				await fs.unlink(currentPath);
			}
		}

		logger.info(`Emptied folder: ${fullPath}`);
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			// Folder doesn’t exist → no action needed
			logger.info(`Folder not found: ${folderPath}`);
		} else {
			console.error(`Error while emptying folder: ${err}`);
			throw err;
		}
	}
};

// ---------------------- PASSWORD FUNCTIONS ----------------------

async function hashPassword(password: string): Promise<string> {
	try {
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw error;
	}
}

async function comparePassword(
	plainPassword: string,
	hashedPassword: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(plainPassword, hashedPassword);
	} catch (error) {
		console.error("Error comparing passwords:", error);
		throw error;
	}
}

// ---------------------- JWT FUNCTIONS ----------------------

function generateJWTToken(payload: object | string, expiresInMinutes?: number): string {
	try {
		let expiresIn: number | string = JWT_EXPIRE_TIME;
		
		if(expiresInMinutes && expiresInMinutes>0) {
			expiresIn = expiresInMinutes*60;
		}

		const signOptions: SignOptions = {
			expiresIn: expiresIn as unknown as SignOptions["expiresIn"],
		};

		const token = jwt.sign(payload, JWT_SECRET, signOptions);
		return token;
	} catch (err) {
		console.error("Error generating JWT:", err);
		throw err;
	}
}

// ---------------------- RANDOM CODES ----------------------

function generateUserReferalCode(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const length = Math.floor(Math.random() * 3) + 4; // random length 4-6
	let code = "";

	for (let i = 0; i < length; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return code;
}

function generateOTP(): string {
	const chars = "0123456789";
	const length = constants.OTP_LENGTH;
	let code = constants.BLANK;

	for (let i = 0; i < length; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return code;
}

// ---------------------- TIME UTIL ----------------------

function getFutureTime(minutes: number): Date {
	const now = new Date();
	return new Date(now.getTime() + minutes * 60000); // add minutes in ms
}

function ensureFolder(folderPath: string) {
  if (!fileSystem.existsSync(folderPath)) {
	fileSystem.mkdirSync(folderPath, { recursive: true });
  }
};

function validateFields<T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[] = []
): { valid: true } | { valid: false; missingFields: (keyof T)[], message: string } {
  const missing: (keyof T)[] = [];
  let message: string = constants.BLANK;

  for (const field of requiredFields) {
	obj[field] = getString(obj[field]);

    if (!obj[field]) {
		missing.push(field);
		message = `${String(field)} is required!`
		break;
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      missingFields: missing,
	  message
    };
  }

  return { valid: true };
}

function getString(str: string): any {
	if (typeof str !== 'string') {return str;}
	return str
		.replace(/<[^>]*>?/gm, '') // strip HTML tags
		.replace(/[&<>"'`]/g, (match) => { // escape special chars
			const escape:any = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				'\'': '&#x27;',
				'`': '&#x60;',
			};
			return escape[match];
		})
		.trim();
}

function toMongoDate(timestampInSeconds: number) {return new Date(timestampInSeconds * 1000);}


export default {
	isBlank,
	createResponse,
	sendSuccessResponse,
	sendFailedResponse,
	hashPassword,
	comparePassword,
	generateJWTToken,
	generateUserReferalCode,
	generateOTP,
	getFutureTime,
	ensureFolder,
	validateFields,
	getString,
	deleteFileIfExists,
	toMongoDate
}