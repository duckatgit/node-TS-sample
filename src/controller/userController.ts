import { Request, Response } from "express";
import { responseCode, responseMsg } from "../common/response";
import utils from "../common/utils";
import userManager from "../manager/user.manager";
import logger from "../service/logger";


const registerDriver = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.registerDriverManager(req.body, res);

    } catch (error: unknown) {
        logger.error(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.verifyUserManager(req.body, req.files, res);
        
    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const saveVehicleInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);
        
        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }
        
        await userManager.vehicleManager(req.body, req.files, res);
        
    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const saveUserBankingDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.userBankManager(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const fetchUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.params)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        const userId = req.params.id;

        await userManager.fetchUserData(userId, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const fetchUserStageWiseDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        const {userId, stage} = req.body

        await userManager.fetchStageWiseUserData(userId, stage, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const submitDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.params)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        const userId = req.params.id;

        await userManager.handleSubmitData(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
} 

const signInUser = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.handleUserSignIn(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.handleForgotPassword(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.resendOTP(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.verifyOTP(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await userManager.resetPassword(req.body, res);

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

export default {
    registerDriver,
    verifyUser,
    saveVehicleInfo,
    saveUserBankingDetails,
    fetchUserDetails,
    fetchUserStageWiseDetails,
    submitDetails,
    signInUser,
    forgotPassword,
    resendOTP,
    verifyOTP,
    resetPassword,
}