import { Response } from "express";
import { constants } from "../common/constants";
import { DbOperationObject, IResponseObj } from "../common/interface";
import { responseCode, responseMsg } from "../common/response";
import utils from "../common/utils";
import { performDbOperations, performSingleDBOperation } from "../db/db";
import userHelper from "../helper/user.helper";
import { forgotPasswordModel, tempUserModel, userModel, vehicleModel } from "../model/index";
import { ITempUser } from '../model/tempUser.model';
import logger from "../service/logger";
import userRepository from "../repository/user.repository";

const registerDriverManager = async (body: any, res: Response) => {
    try {
        let message = "";
        let result: any = {};
        let userId: string = body.userId;

        if(utils.isBlank(userId) === true) {
            const responseObj: IResponseObj = await userHelper.handleDriverRegistration(body);
    
            if(responseObj.responseCode !== responseCode.SUCCESS) {
                return utils.sendFailedResponse(res, responseObj.responseCode, responseObj.responseMsg, responseObj.dbObject);
            }
    
            const userObject = responseObj.dbObject;
    
            if (userObject) {
                [result] = await performSingleDBOperation(userObject);
                message = "User Created Successfully";
            }
        }else {
            const responseObj: IResponseObj = await userHelper.updateTempDriverDetails(body);
    
            if(responseObj.responseCode !== responseCode.SUCCESS) {
                return utils.sendFailedResponse(res, responseObj.responseCode, responseObj.responseMsg, responseObj.dbObject);
            }
    
            const userObject = responseObj.dbObject;
    
            if (userObject) {
                [result] = await performSingleDBOperation(userObject);
                message = "User Updated Successfully";
            }
        }

        return utils.sendSuccessResponse(res,responseCode.SUCCESS, message, {userId: result._id});
    } catch (error) {
        logger.info(`Error from registerDriver: `, error)
        throw error;
    }
};

const verifyUserManager = async (body: any, files: any,res: Response) => {
    try {
        const responseObj: IResponseObj = await userHelper.handleUserVerification(body, files);
    
        if(responseObj.responseCode !== responseCode.SUCCESS) {
            return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
        }
                
        if(responseObj.dbObject) {
            await performSingleDBOperation(responseObj.dbObject);
        }
    
        utils.sendSuccessResponse(res, responseObj.responseCode, responseObj.responseMsg);
        
    } catch (error) {
        throw error
    }finally {
        utils.deleteFileIfExists(constants.FILE_UPLOAD_PATH);
    }
};

const vehicleManager = async (body: any, files: any,res: Response) => {
    try {
        const responseObj: IResponseObj = await userHelper.handleSaveVehicleInfo(body, files);
    
        if(responseObj.responseCode !== responseCode.SUCCESS) {
            return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
        } 
    
        if(responseObj.dbObject) {
            await performSingleDBOperation(responseObj.dbObject);
        }
    
        utils.sendSuccessResponse(res,responseObj.responseCode, responseObj.responseMsg);
        
    } catch (error) {
        throw error
    }finally {
        utils.deleteFileIfExists(constants.FILE_UPLOAD_PATH);
    }
};

const userBankManager = async (body: any, res: Response) => {
    const responseObj: IResponseObj = await userHelper.saveBankigDetails(body);

    if(responseObj.responseCode !== responseCode.SUCCESS) {
        return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
    } 

    if(responseObj.dbObject) {
        await performSingleDBOperation(responseObj.dbObject);
    }

    utils.sendSuccessResponse(res,responseObj.responseCode, responseObj.responseMsg);
};

const fetchStageWiseUserData = async (userId: string, stage: number, res: Response) => {
    const responseObj: any = await userHelper.fetchUserStageData(userId, stage);

    if(responseObj.responseCode !== responseCode.SUCCESS) {
        return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
    } 

    utils.sendSuccessResponse(res,responseObj.responseCode, responseObj.responseMsg, responseObj.data);
};

const fetchUserData = async (userId: string, res: Response) => {
    const responseObj: any = await userHelper.fetchUserData(userId);

    if(responseObj.responseCode !== responseCode.SUCCESS) {
        return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
    } 

    utils.sendSuccessResponse(res,responseObj.responseCode, responseObj.responseMsg, responseObj.data);
};

const handleSubmitData = async (body: any, res: Response ) => {
    const {userId} = body;
    const responseObj: any = await userHelper.validateUserId(userId);
    let finalUserId = constants.BLANK;
    let vehicleId = constants.BLANK;

    if(responseObj.responseCode !== responseCode.SUCCESS) {
        return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
    } 

    const tempUser: ITempUser = responseObj.data;

    // Save User

    const userObject: any = userHelper.prepareUserObject(tempUser); 

    const dbObject = {
        type: constants.INSERT,
        model: userModel,
        doc: userObject
    };

    const [userDBObj] = await performSingleDBOperation(dbObject);
    finalUserId = userDBObj._id;

    // Save Vehicle
    const vehicleObject: any = userHelper.prepareVehicleObject(tempUser, finalUserId); 

    const newVehicleObject = {
        type: constants.INSERT,
        model: vehicleModel,
        doc: vehicleObject
    };

    const [vehicleDBObj] = await performSingleDBOperation(newVehicleObject);
    vehicleId = vehicleDBObj._id;

    // Save Other Details

    const dbList: any = userHelper.prepareUserDocAndBankDBObjectList(tempUser, finalUserId, vehicleId);

    tempUser.stageLocked = true;

    dbList.push({
        type: constants.UPDATE,
        model: tempUserModel,
        query: { _id: tempUser._id }, 
        update: { $set: tempUser}
    });

    await performDbOperations(dbList);

    utils.sendSuccessResponse(res,responseCode.SUCCESS, responseMsg.SUCCESS,);
};

const handleUserSignIn = async (body: any, res: Response ) => {
    
    const responseObj: any = await userHelper.handleUserSignIn(body);

    if(responseObj.responseCode !== responseCode.SUCCESS) {
        return utils.sendFailedResponse(res,responseObj.responseCode, responseObj.responseMsg);
    } 
    
    utils.sendSuccessResponse(res,responseObj.responseCode, responseObj.responseMsg, responseObj.data);

};

const handleForgotPassword = async (body: any, res: Response) => {
    const {email, phoneNo} = body;

    if(utils.isBlank(email) === true && utils.isBlank(phoneNo) === true) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.EMAIL_PHONE_NOT_PROVIDED);
    }

    const existingUser = await userRepository.findUser(
        email ? 
        { email, isActive: true } : 
        { phoneNo, isActive: true }
    );

    if (!existingUser) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
    }

    const userId = existingUser._id;
    const otp = utils.generateOTP();
    const hashedOTP = await utils.hashPassword(otp)
    const expiresAt = utils.getFutureTime(constants.OTP_EXPIRE_MINUTES);
    const attemptsLeft = constants.OTP_ATTEMPT;

    const dbObj = {
        type: constants.INSERT,
        model: forgotPasswordModel,
        doc: { 
            userId,
            otpHash:hashedOTP,
            expiresAt,
            attemptsLeft         
        }
    }

    await performSingleDBOperation(dbObj);

    if(utils.isBlank(email) === false) {
        userHelper.sendForgotPasswordMail(existingUser.name as string, otp, email);

    }else {
        userHelper.sendForgotPasswordSMS(otp, phoneNo);
    }

    utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.OTP_SUCCESS, {userId});
};

const resendOTP = async (body: any, res: Response) => {
    const {email, phoneNo} = body;

    if(utils.isBlank(email) === true && utils.isBlank(phoneNo) === true) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.EMAIL_PHONE_NOT_PROVIDED);
    }

    const existingUser = await userRepository.findUser(
        email ? 
        { email, isActive: true } : 
        { phoneNo, isActive: true }
    );

    if (!existingUser) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
    }

    const userId = existingUser._id;
    const paramObj = {
        ...(email ? {email}: {phoneNo}),
        userId,
        attemptsLeft: { $gt: 0 },
        expiresAt: { $gt: new Date() },
        used: false,
    }

    const existingOTPObject = await userHelper.findOTPObject(paramObj);

    if (!existingOTPObject) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.OTP_EXPIRED);
    }

    const otp = utils.generateOTP();
    const hashedOTP = await utils.hashPassword(otp)

    existingOTPObject.otpHash = hashedOTP;

    const dbObject = {
        type: constants.UPDATE,
        model: forgotPasswordModel,
        query: { _id: existingOTPObject._id }, 
        update: { $set: existingOTPObject}
    }

    await performSingleDBOperation(dbObject);

    if(utils.isBlank(email) === false) {
        await userHelper.sendForgotPasswordMail(existingUser.name as string, otp, email);

    }else {
        await userHelper.sendForgotPasswordSMS(otp, phoneNo);
    }

    utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.OTP_SUCCESS, {userId});
}

const verifyOTP = async (body: any, res: Response) => {
    const {userId, otp} = body;

    if(utils.isBlank(otp) === true) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.OTP_REQ);
    }

    const existingUser = await userRepository.findUser( { userId, isActive: true } );

    if (!existingUser) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
    }

    const paramObj = {
        userId,
        attemptsLeft: { $gt: 0 },
        expiresAt: { $gt: new Date() },
        used: false,
    }

    const existingOTPObject = await userHelper.findOTPObject(paramObj);

    if (!existingOTPObject) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.OTP_EXPIRED);
    }

    const isMatched: boolean = await utils.comparePassword(otp, existingOTPObject.otpHash);

    const dbObject = {
        type: constants.UPDATE,
        model: forgotPasswordModel,
        query: { _id: existingOTPObject._id }, 
        update: { $set: existingOTPObject}
    }

    if(isMatched === false) {
        existingOTPObject.attemptsLeft = existingOTPObject.attemptsLeft ?existingOTPObject.attemptsLeft - 1 : 0; 

        await performSingleDBOperation(dbObject);

        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.WRONG_OTP);
    }

    existingOTPObject.used = true;

    await performSingleDBOperation(dbObject);

    const payload = {
        id: userId,
        name: existingUser.name,
        email: existingUser.email,
        phoneNo: existingUser.phoneNo,
        role: existingUser.role,
    }

    const token = utils.generateJWTToken(payload, constants.RESET_PASS_TOKEN_EXPIRE_MINUTE);

    utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.OTP_SUCCESS, {userId, token});

}

const resetPassword = async (body: any, res: Response) => {
    const {userId, newPassword, confirmPassword} = body
    const requiredFields = ['userId', 'newPassword', 'confirmPassword'];

    const validateObj = utils.validateFields(body, requiredFields);
    
    if(validateObj.valid === false) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, validateObj.message);
    }

    const existingUser = await userRepository.findUser( { userId, isActive: true } );

    if (!existingUser) {
        return utils.sendFailedResponse(res,responseCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
    }

    if(newPassword.length < constants.PASSWORD_MAX_LENGTH) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.PASSWORD_LENGTH_ERROR);
    }

    if (newPassword !== confirmPassword) {
        return utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.CONFIRM_PASSWORD_NOT_MATCHED);
    }

    const hashedPassword = await utils.hashPassword(newPassword);
    existingUser.password = hashedPassword;

    const dbObj: DbOperationObject = {
        type: constants.UPDATE,
        model: userModel,
        query: { _id: userId }, 
        update: { $set: existingUser}
    };

    await performSingleDBOperation(dbObj);

    utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.RESET_PASSWORD_SUCCESS);
}

export default {
    registerDriverManager,
    verifyUserManager,
    vehicleManager,
    userBankManager,
    fetchUserData,
    fetchStageWiseUserData,
    handleSubmitData,
    handleUserSignIn,
    handleForgotPassword,
    resendOTP,
    verifyOTP,
    resetPassword,
}