import { Response } from "express"
import utils from "../common/utils";
import { responseCode, responseMsg } from "../common/response";

const driverDashboardManager = async (body: any, res: Response) => {
    try {
    
        utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.SUCCESS);
        
    } catch (error) {
        throw error
    }
}

export default {
    driverDashboardManager,
}