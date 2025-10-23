import logger from "../service/logger";
import { Request, Response } from "express";
import { responseCode, responseMsg } from "../common/response";
import utils from "../common/utils";
import dashboardManager from "../manager/dashboard.manager";


const driverDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(req.body)}`);

        if (!req) {
            utils.sendFailedResponse(res,responseCode.BAD_REQUEST, responseMsg.BAD_REQUEST);
            return;
        }

        await dashboardManager.driverDashboardManager(req.body, res);

    } catch (error: unknown) {
        logger.error(error);
        utils.sendFailedResponse(res,responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

export default {
    driverDashboard
}