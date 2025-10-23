import { eventTags } from "../common/eventTags";
import { responseCode, responseMsg } from "../common/response";
import riderManager from "../manager/rider.manager";
import logger from "../service/logger";
import { getIO } from "../service/socketConfig.service";

const requestRide = async (data: any) => {
    const io = getIO();
    try {
        logger.info(`request received from ${eventTags.REQUEST_RIDE}, body: ${JSON.stringify(data)}`);

        if (!data) {
            return io.emit(eventTags.RIDER_ERROR, {responseCode: responseCode.BAD_REQUEST, responseMsg: responseMsg.BAD_REQUEST});
        }

        return await riderManager.managerRiderRideRequest(data);
        
    } catch (error) {
        logger.info(error);
        io.emit(
            eventTags.RIDER_ERROR, 
            {responseCode: responseCode.INTERNAL_SERVER_ERROR, responseMsg: responseMsg.INTERNAL_SERVER_ERROR}
        );
    }
}

export default {
    requestRide
};