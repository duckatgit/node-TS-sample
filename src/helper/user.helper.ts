import fs from 'fs/promises';
import path from 'path';
import { constants, documentFileKeys, userVerificationFields, vehicleImageFields } from "../common/constants";
import { IResponseObj } from '../common/interface';
import { responseCode, responseMsg } from "../common/response";
import utils from "../common/utils";
import { BUCKET, PutObjectCommand, s3, S3_BASE } from "../config/s3";
import { forgotPasswordModel, tempUserModel, userBankModel, userDocumentModel, userModel, vehicleDocumentModel } from '../model/index';
import { bankObjFields, ITempUser, userObjFields, vehicleObjFields } from '../model/tempUser.model';
import mailService from '../service/mailer.service';
import smsService from '../service/sms.service';
import userRepository from '../repository/user.repository';
import { performSingleDBOperation } from '../db/db';


type UserExistType = typeof constants.MAIN | typeof constants.TEMP | typeof constants.NONE;

interface FindUserResult<T> {
    userObj: T | null;
    isExist: UserExistType;
}


const handleDriverRegistration = async (body: any): Promise<IResponseObj> => {
    const { name, email, phoneNo, password, confirmPassword, gender, role } = body;
    const appliedReferralCode = body.applied_referral_code || null;
    const requiredFields = ['name', 'password', 'confirmPassword', 'gender', 'role'];
    let responseObj: IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    if (utils.isBlank(email) === true && utils.isBlank(phoneNo) === true) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = 'Either Email or Phone No. is required';

        return responseObj;
    }

    const validateObj = utils.validateFields(body, requiredFields);

    if (validateObj.valid === false) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = validateObj.message;

        return responseObj;
    }

    // Check for existingUser in MainUser Table & TempUser Table
    const userDBObj = await findUserForRegister(email ? { email } : { phoneNo });
    const userExist = userDBObj.isExist;

    if (userExist === constants.MAIN) {
        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = email ? responseMsg.EMAIL_ALREADY_EXIST : responseMsg.PHONE_ALREADY_EXIST;

        return responseObj;
    }

    if (userExist === constants.TEMP) {
        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = responseMsg.INCOMPLETE_REGISTRATION;
        responseObj.dbObject = userDBObj.userObj;

        return responseObj;
    }

    if (password.length < constants.PASSWORD_MAX_LENGTH) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = responseMsg.PASSWORD_LENGTH_ERROR;

        return responseObj;
    }


    if (password !== confirmPassword) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = responseMsg.CONFIRM_PASSWORD_NOT_MATCHED;

        return responseObj;
    }

    const userReferralCode = utils.generateUserReferalCode();
    const hashedPassword = await utils.hashPassword(password);

    responseObj.dbObject = {
        type: constants.INSERT,
        model: tempUserModel,
        doc: {
            name,
            email,
            phoneNo,
            password: hashedPassword,
            userReferralCode,
            gender,
            role,
            appliedReferralCode,
            stage: constants.IDENTIRY_VERIFICATION_STAGE,
        }
    }

    return responseObj;
};

const updateTempDriverDetails = async (body: any) => {
    const {
        userId,
        name,
        email,
        phoneNo,
        password,
        confirmPassword,
        gender,
        role,
        appliedReferralCode
    } = body;
    const requiredFields = ['name', 'password', 'confirmPassword', 'gender', 'role'];

    let responseObj: IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    if (utils.isBlank(email) === true && utils.isBlank(phoneNo) === true) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = 'Either Email or Phone No. is required';

        return responseObj;
    }

    const validateObj = utils.validateFields(body, requiredFields);

    if (validateObj.valid === false) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = validateObj.message;

        return responseObj;
    }

    const dbUserObj = await tempUserModel.findOne({ _id: userId, stageLocked: false }).lean();

    if (!dbUserObj) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    dbUserObj.name = name
    dbUserObj.email = email
    dbUserObj.phoneNo = phoneNo

    if (utils.isBlank(password) === false) {
        if (password.length < constants.PASSWORD_MAX_LENGTH) {
            responseObj.responseCode = responseCode.BAD_REQUEST;
            responseObj.responseMsg = responseMsg.PASSWORD_LENGTH_ERROR;

            return responseObj;
        }

        if (password !== confirmPassword) {
            responseObj.responseCode = responseCode.BAD_REQUEST;
            responseObj.responseMsg = responseMsg.CONFIRM_PASSWORD_NOT_MATCHED;

            return responseObj;
        }

        const hashedPassword = await utils.hashPassword(password);
        dbUserObj.password = hashedPassword;
    }

    if (utils.isBlank(role) === false) {
        dbUserObj.role = role;
    }

    if (utils.isBlank(appliedReferralCode) === false) {
        dbUserObj.appliedReferralCode = appliedReferralCode;
    }


    responseObj.dbObject = {
        type: constants.UPDATE,
        model: tempUserModel,
        query: { _id: userId },
        update: { $set: dbUserObj }
    };

    return responseObj;
}

const handleUserVerification = async (body: any, files: any) => {
    const filesObject = files;
    const userId = body.userId;
    let responseObj: IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    const keysArray = userVerificationFields.reduce((acc: string[], { name }) => {
        if (name !== documentFileKeys.PROFILE_PIC) acc.push(name);
        return acc;
    }, []);

    const missingFiles = Object.keys(filesObject).filter((key) => !filesObject[key] || !filesObject[key][0]);

    if (missingFiles.length > 0) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = "Please upload all documents"

        return responseObj
    }

    const existingUser = await userRepository.findUser({ _id: userId, is_active: constants.TRUE });

    if (existingUser) {

        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = responseMsg.USER_ALREADY_EXIST;

        return responseObj;
    }

    const tempUserExist = await tempUserModel.findById(userId);

    if (!tempUserExist) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    let userDocuments: any = [];

    for (const fieldName of keysArray) {
        const filesArray = filesObject[fieldName];
        const file = filesArray[0];

        let documentUrl = await saveFilesToS3(file);

        const result = {
            documentUrl,
            documentType: fieldName.toUpperCase()
        }

        userDocuments.push(result);
    }

    const profilePicObj = filesObject[documentFileKeys.PROFILE_PIC][0];
    const documentUrl = await saveFilesToS3(profilePicObj);

    const setObj = {
        stage: constants.VEHICLE_INFO_STAGE,
        profilePic: documentUrl,
        userDocuments
    }

    responseObj.dbObject = {
        type: constants.UPDATE,
        model: tempUserModel,
        query: { _id: tempUserExist._id },
        update: { $set: setObj }
    }

    return responseObj;
};

const handleSaveVehicleInfo = async (body: any, files: any) => {
    const { userId, vehicleNo, type } = body;
    const filesObject = files;
    const keysArray = vehicleImageFields.map(element => { return element.name });
    let responseObj: IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    const missingFiles = Object.keys(filesObject).filter((key) => !filesObject[key] || !filesObject[key][0]);

    if (missingFiles.length > 0) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = "Please upload all documents"

        return responseObj
    }


    if (utils.isBlank(vehicleNo) === true || utils.isBlank(type) === true) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = 'Vehicle Information Missing';

        return responseObj;
    }

    const existingUser = await userRepository.findUser({ _id: userId, is_active: constants.TRUE });

    if (existingUser) {

        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = responseMsg.USER_ALREADY_EXIST;

        return responseObj;
    }

    const tempUserExist = await tempUserModel.findById(userId);

    if (!tempUserExist) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    let vehicleDocuments: any = [];

    for (const fieldName of keysArray) {
        const filesArray = filesObject[fieldName];
        const file = filesArray[0];

        let documentUrl = await saveFilesToS3(file);

        const result = {
            documentUrl,
            documentType: fieldName.toUpperCase()
        }

        vehicleDocuments.push(result);
    }

    const doc: any = { vehicleNo, vehicleType: type, vehicleDocuments, stage: constants.BANK_INFO_STAGE };

    responseObj.dbObject = {
        type: constants.UPDATE,
        model: tempUserModel,
        query: { _id: tempUserExist._id },
        update: { $set: doc }
    }

    return responseObj
};

async function saveBankigDetails(body: any) {
    const { userId, accountHolderName, accountNumber, sortCode } = body;
    const requiredFields = ['userId', 'accountHolderName', 'accountNumber', 'sortCode',];
    let responseObj: IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    const validateObj = utils.validateFields(body, requiredFields);

    if (validateObj.valid === false) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = validateObj.message;

        return responseObj;
    }

    const existingUser = await userRepository.findUser({ _id: userId, is_active: constants.TRUE });

    if (existingUser) {

        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = responseMsg.USER_ALREADY_EXIST;

        return responseObj;
    }

    const tempUserExist = await tempUserModel.findById(userId);

    if (!tempUserExist) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    const doc: any = {
        accountHolderName,
        accountNumber,
        sortCode
    };

    doc.stage = constants.REVIEW_STAGE;

    responseObj.dbObject = {
        type: constants.UPDATE,
        model: tempUserModel,
        query: { _id: tempUserExist._id },
        update: { $set: doc }
    }

    return responseObj;
}

async function fetchUserData(userId: string) {
    let responseObj: { responseCode: number, responseMsg: string, data?: any } = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    if (utils.isBlank(userId)) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = 'userId is required!';

        return responseObj;
    }

    const formattedUserId: string = utils.getString(userId);

    const tempUserObj = await tempUserModel.findOne({ _id: formattedUserId, stageLocked: false }).lean();

    if (!tempUserObj) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    if (tempUserObj.stage > constants.REVIEW_STAGE) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = "Invalid stage request!";

        return responseObj;
    }


    const userFields: (keyof ITempUser)[] = [...userObjFields];
    const vehicleFields: (keyof ITempUser)[] = [...vehicleObjFields];
    const bankFields: (keyof ITempUser)[] = [...bankObjFields];

    const userDetailsObj: any = {};
    const vehicleDetailsObj: any = {};
    const bankDetailsObj: any = {};
    const userDocuments: any = tempUserObj.userDocuments

    userFields.forEach((key: keyof ITempUser) => {
        userDetailsObj[key] = tempUserObj[key];
    });

    vehicleFields.forEach((key: keyof ITempUser) => {
        vehicleDetailsObj[key] = tempUserObj[key];
    });

    bankFields.forEach((key: keyof ITempUser) => {
        bankDetailsObj[key] = tempUserObj[key];
    });

    if (userDocuments.length > constants.FALSE) {
        const profilePic = tempUserObj.profilePic;
        userDocuments.push({ documentUrl: profilePic, documentType: documentFileKeys.PROFILE_PIC });
    }

    responseObj.data = {
        userDetails: userDetailsObj,
        vehicleDetails: vehicleDetailsObj,
        bankDetails: bankDetailsObj,
        userDocuments: userDocuments,
        vehicleDocuments: tempUserObj.vehicleDocuments,
        stage: tempUserObj.stage
    };

    return responseObj;
}

async function fetchUserStageData(userId: string, stage: number) {

    let responseObj: { responseCode: number, responseMsg: string, data?: any } = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    if (utils.isBlank(userId)) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = 'userId is required!';

        return responseObj;
    }

    const formattedUserId: string = utils.getString(userId);

    const tempUserObj = await tempUserModel.findOne({ _id: formattedUserId, stageLocked: false });

    if (!tempUserObj) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }


    const userFields: (keyof ITempUser)[] = [...userObjFields];
    const vehicleFields: (keyof ITempUser)[] = [...vehicleObjFields];
    const bankFields: (keyof ITempUser)[] = [...bankObjFields];

    const resultObj: any = {};

    if (stage > constants.BANK_INFO_STAGE || stage < constants.USER_DETAILS_STAGE) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = "Invalid stage request!";

        return responseObj;
    }

    if (stage === constants.USER_DETAILS_STAGE) {
        userFields.forEach((key: keyof ITempUser) => {
            resultObj[key] = tempUserObj[key];
        });
    }

    if (stage === constants.IDENTIRY_VERIFICATION_STAGE) {
        const userDocuments = tempUserObj.userDocuments;
        const profilePic = tempUserObj.profilePic;
        userDocuments.push({ documentUrl: profilePic, documentType: documentFileKeys.PROFILE_PIC });
        resultObj.files = userDocuments;
    }

    if (stage === constants.VEHICLE_INFO_STAGE) {
        vehicleFields.forEach((key: keyof ITempUser) => {
            resultObj[key] = tempUserObj[key];
        });
        resultObj.files = tempUserObj.vehicleDocuments;
    }

    if (stage === constants.BANK_INFO_STAGE) {
        bankFields.forEach((key: keyof ITempUser) => {
            resultObj[key] = tempUserObj[key];
        });
    }


    responseObj.data = resultObj

    return responseObj;
}

async function validateUserId(userId: string) {
    let responseObj: any = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    const existingUser = await userRepository.findUser({ _id: userId, is_active: constants.TRUE });

    if (existingUser) {

        responseObj.responseCode = responseCode.ALREADY_EXIST;
        responseObj.responseMsg = 'User Already Registered in the System.';

        return responseObj;
    }

    const tempUserExist = await tempUserModel.findOne({ _id: userId, stageLocked: false });

    if (!tempUserExist) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    responseObj.data = tempUserExist;

    return responseObj;
}

function prepareUserObject(tempUser: ITempUser) {
    const userFields: (keyof ITempUser)[] = ['name', 'phoneNo', 'email', 'gender', 'password', 'role', 'profilePic', 'userReferralCode', 'appliedReferralCode'];

    const userObject: any = {};

    userFields.forEach((key: keyof ITempUser) => {
        userObject[key] = tempUser[key];
    })

    return userObject;
}

function prepareVehicleObject(tempUser: ITempUser, userId: string) {
    const vahicleFields: (keyof ITempUser)[] = ['vehicleNo', 'vehicleType'];

    const vehicleObject: any = { userId };

    vahicleFields.forEach((key: keyof ITempUser) => {
        vehicleObject[key] = tempUser[key];
    })

    return vehicleObject;
}

function prepareUserDocAndBankDBObjectList(tempUser: ITempUser, userId: string, vehicleId: string) {
    const bankFields: (keyof ITempUser)[] = ['accountHolderName', 'accountNumber', 'sortCode',];

    const userJSONObj = tempUser.toJSON();

    const userDocList: any = userJSONObj.userDocuments;
    const vehicleDocList: any = userJSONObj.vehicleDocuments;
    const bankObject: any = { userId };

    const dbList: any = [];

    bankFields.forEach((key: keyof ITempUser) => {
        bankObject[key] = tempUser[key];
    })

    const bankdbObj = {
        type: constants.INSERT,
        model: userBankModel,
        doc: bankObject
    }

    dbList.push(bankdbObj);


    userDocList.forEach((docObject: any) => {
        docObject['userId'] = userId;

        const userDocObj = {
            type: constants.INSERT,
            model: userDocumentModel,
            doc: docObject
        }

        dbList.push(userDocObj)

    });

    vehicleDocList.forEach((docObject: any) => {
        docObject['userId'] = userId;
        docObject['vehicleId'] = vehicleId;

        const vehicleDocObj = {
            type: constants.INSERT,
            model: vehicleDocumentModel,
            doc: docObject
        }

        dbList.push(vehicleDocObj)
    });

    return dbList;

}

async function handleUserSignIn(body: any) {
    const { email, phoneNo, password, } = body;
    const requiredFields = ['password'];
    let responseObj: any = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };


    if (utils.isBlank(email) === true && utils.isBlank(phoneNo) === true) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = responseMsg.EMAIL_PHONE_NOT_PROVIDED;

        return responseObj;
    }

    const validateObj = utils.validateFields(body, requiredFields);

    if (validateObj.valid === false) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = validateObj.message;

        return responseObj;
    }

    const existingUser = await userRepository.findUser(email ?
        { email, isActive: true } :
        { phoneNo, isActive: true }
    );

    if (!existingUser) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    // if (existingUser.isVerified === false) {
    //     responseObj.responseCode = responseCode.UNAUTHORIZED;
    //     responseObj.responseMsg = responseMsg.USER_NOT_VERIFY;
    //     return responseObj;
    // }

    const passwordMatched = await utils.comparePassword(password, existingUser.password);

    if (passwordMatched) {
        const payload = { _id: existingUser._id, name: existingUser.name, role: existingUser.role, loginTime: Date() };

        const token = utils.generateJWTToken(payload);
        const skippedFeildList = ['password', 'applied_referral_code', 'createdAt', 'updatedAt']

        const formattedObj = getformattedObject(existingUser.toObject(), skippedFeildList);

        responseObj.data = { userData: formattedObj, token };

        return responseObj;

    } else {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = responseMsg.INVALID_CREDENTIALS;
        return responseObj;
    }
}

async function findUserForRegister(paramObj: Record<string, unknown>): Promise<FindUserResult<any>> {
    // Try main User table first
    const mainUser = await userModel.findOne({ ...paramObj, isActive: true }).lean();
    if (mainUser) {
        return { userObj: mainUser, isExist: constants.MAIN };
    }

    // If not found, try Temp User table
    const tempUser = await tempUserModel.findOne({ ...paramObj, stageLocked: false }).lean();
    if (tempUser) {
        return { userObj: tempUser, isExist: constants.TEMP };
    }

    // Not found in either table
    return { userObj: null, isExist: "NONE" };
}

const findOTPObject = async (paramObj: any) => {
    return await forgotPasswordModel.findOne(paramObj).lean();
}

async function saveFilesToS3(file: any) {
    const filePath = path.resolve(file.path);
    const fileName = path.basename(file.filename);
    const contentType = file.mimetype;

    try {
        // Read local file
        const fileContent = await fs.readFile(filePath);

        // Upload to S3
        const uploadParams: any = {
            Bucket: BUCKET,
            Key: fileName,
            Body: fileContent,
            ContentType: contentType,
            ACL: 'public-read'
        };

        const response = await s3.send(new PutObjectCommand(uploadParams));

        const s3Url = `${S3_BASE}/${fileName}`;

        // Delete local file
        await fs.unlink(filePath);

        return s3Url;

    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

function getformattedObject(obj: any, skippedFeildList: any) {
    let formattedObj: any = {}

    for (const key of Object.keys(obj)) {
        if (skippedFeildList.includes(key) === false) {
            formattedObj[key] = obj[key];
        }
    }

    return formattedObj
}

async function sendForgotPasswordMail(userName: string, otp: string, email: string) {
    const subject = 'Riya Ride - Reset Password OTP';
    const emailBody = `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>Password Reset</title>
            <style>
            /* Some clients respect this; keep minimal. Inline styles are used for max compatibility. */
            @media only screen and (max-width:600px){
                .container { padding: 16px !important; }
                .content { width: 100% !important; }
                .otp { font-size: 28px !important; }
            }
            </style>
        </head>
        <body style="margin:0;padding:0;background-color:#F4F6F8;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <!-- Preheader (hidden preview text) -->
            <div style="display:none;max-height:0;overflow:hidden;color:transparent;">
            Use this one-time code to reset your password. Expires in {{expiry_minutes}} minutes.
            </div>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;background-color:#F4F6F8;padding:32px 0;">
            <tr>
                <td align="center">
                <!-- Main container -->
                <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;box-shadow:0 6px 18px rgba(15,23,42,0.08);overflow:hidden;">
                    <!-- Header / Branding -->
                    <tr>
                    <td style="padding:24px 28px 0;text-align:center;background:linear-gradient(90deg,#0ea5a4,#3b82f6);color:#fff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.2px;">Riya Ride</h1>
                        <p style="margin:6px 0 20px;font-size:13px;opacity:0.95;">Password reset request</p>
                    </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                    <td style="padding:28px;" align="left">
                        <div style="color:#0f172a;font-size:15px;line-height:1.5;">
                        <p style="margin:0 0 12px;">Hi ${userName || 'there'},</p>

                        <p style="margin:0 0 18px;">
                            We received a request to reset the password for your Riya Ride account. Use the one-time code below to continue. This code will expire in <strong>${constants.OTP_EXPIRE_MINUTES} minutes</strong>.
                        </p>

                        <!-- OTP block -->
                        <div style="margin:20px 0;padding:18px 14px;border-radius:10px;background:#f8fafc;border:1px solid #e6eef8;display:inline-block;">
                            <p style="margin:0;text-align:center;font-size:18px;color:#475569">Your verification code</p>
                            <p class="otp" style="margin:8px 0 0;text-align:center;font-weight:800;font-size:36px;letter-spacing:3px;color:#0f172a;">
                            ${otp}
                            </p>
                        </div>

                        <p style="margin:0 0 8px;color:#475569;">
                            If you didn't request this, you can safely ignore this email — no changes will be made to your account.
                        </p>
                        </div>
                    </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                    <td style="padding:18px 28px 24px;background:#fbfdff;text-align:center;color:#9aa4b2;font-size:13px;">
                        <p style="margin:0 0 6px;">For your security, never share this code with anyone.</p>
                        <p style="margin:0;">© ${new Date().getFullYear()} Riya Ride. All rights reserved.</p>
                    </td>
                    </tr>
                </table>
                </td>
            </tr>
            </table>
        </body>
        </html>
    `
    return await mailService.sendMail(email, subject, emailBody, true);
}

async function sendForgotPasswordSMS(otp: string, phoneNo: string) {
    const smsBody = `Your Reya Ride password reset code is ${otp}. It will expire in ${constants.OTP_EXPIRE_MINUTES} minutes. Do not share this code with anyone.`;

    return await smsService.sendSMS(smsBody, phoneNo);
}

async function saveUserFromLeadTable(leadUser: any) {
    const userDBObj = {
        type: constants.INSERT,
        model: userModel,
        doc: {
            name: leadUser.fullName,
            phoneNo: leadUser.phoneNumber,
            email: leadUser.email,
            gender: "Female",
            password: leadUser.password,
            role: leadUser.role,
            profilePic: null,
            userReferralCode: utils.generateUserReferalCode(),
            appliedReferralCode: "",
            isVerified: true,
            isActive: true,
        }
    }

    const [user] = await performSingleDBOperation(userDBObj);
    let vehicle: any = {}; 
    if(user.role === constants.DRIVER) {

    }

    return user;
}



export default {
    handleDriverRegistration,
    updateTempDriverDetails,
    handleUserVerification,
    handleSaveVehicleInfo,
    saveBankigDetails,
    fetchUserData,
    fetchUserStageData,
    validateUserId,
    prepareUserObject,
    prepareVehicleObject,
    prepareUserDocAndBankDBObjectList,
    handleUserSignIn,
    findOTPObject,
    sendForgotPasswordMail,
    sendForgotPasswordSMS,
    saveUserFromLeadTable
}