import { constants } from "./constants";

export const responseCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  ALREADY_EXIST: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type ResponseCodeKeys = keyof typeof responseCode;
export type ResponseCodeValues = (typeof responseCode)[ResponseCodeKeys];

export const responseMsg = {
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad Request',
  AUTH_HEADER_MISSING: 'Authorization header missing',
  AUTH_HEADER_INVALID: 'Invalid authorization header format',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid credentials. Please check your email/phone number and password, then try again.',
  NOT_FOUND: 'Resource Not Found.',
  USER_NOT_FOUND: 'User Not Found.',
  USER_NOT_IN_AREA: 'Currently No Driver found in your area, Please try after some time.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error.',
  USER_ALREADY_EXIST: 'User Already Exist in the System.',
  EMAIL_ALREADY_EXIST: 'Email Already Exist in the System.',
  PHONE_ALREADY_EXIST: 'Phone Number Already Exist in the System.',
  EMAIL_PHONE_NOT_PROVIDED: 'Please Provide Either Phone no. or Email Id.',
  CONFIRM_PASSWORD_NOT_MATCHED: 'Password and Confirm Password not matched.',
  PASSWORD_LENGTH_ERROR: `Password must have at least ${constants.PASSWORD_MAX_LENGTH} characters.`,
  SIGN_IN_ERROR: 'Either Email/Phone no. or Password is incorrect.',
  USER_NOT_VERIFY: 'User verification is pending.',
  USER_DOCUMENT_UPLOAD_SUCCESS: 'User Document Uploaded Successfully',
  VEHICLE_DOCUMENT_UPLOAD_SUCCESS: 'Vehicle Document Uploaded Successfully',
  BANK_SAVE_SUCCESS: 'User Bank Details Saved Successfully',
  INCOMPLETE_REGISTRATION: 'Your email/phone is already linked to an ongoing registration. Please continue where you left off to finish your registration.',
  OTP_SUCCESS: 'OTP Successfully send.',
  OTP_EXPIRED: 'OTP expired, please regenerate a new OTP.',
  OTP_REQ: 'OTP required!',
  WRONG_OTP: 'Invalid OTP. Please check and try again.',
  RESET_PASSWORD_SUCCESS: 'Password Reset Successfully.',
  RIDE_ALREADY_TAKEN: 'Ride already taken!',
} as const;

export type ResponseMsgKeys = keyof typeof responseMsg;
export type ResponseMsgValues = (typeof responseMsg)[ResponseMsgKeys];
