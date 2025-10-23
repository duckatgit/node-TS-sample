import { Server, Socket } from "socket.io";
import { responseCode, responseMsg } from "../common/response";
import driverManager from "../manager/driver.manager";
import logger from "../service/logger";
import { eventTags } from "../common/eventTags";
import { getIO } from "../service/socketConfig.service";

const updateLocation = async (data: any) => {
    try {
        logger.info(`request received from driver:updateLocation, body: ${JSON.stringify(data)}`);

        return await driverManager.updateDriverLocationAndStatus(data);

    } catch (error) {
        logger.info(error);
    }
}
    
const acceptRide = async (data: any) => {
    const io = getIO();
    try {
        logger.info(`request received from driver:acceptRide, body: ${JSON.stringify(data)}`);
        
        if (!data) {
            return io.emit(eventTags.DRIVER_ERROR, {responseCode: responseCode.BAD_REQUEST, responseMsg: responseMsg.BAD_REQUEST});
        }

        const {rideId, userId} = data;

        return await driverManager.acceptRideRequest(rideId, userId);

    } catch (error: any) {
        logger.info(error);
        return io.emit(eventTags.DRIVER_ERROR, {responseCode: responseCode.INTERNAL_SERVER_ERROR, responseMsg: error.message});
    }
}




export default {
    updateLocation,
    acceptRide
};