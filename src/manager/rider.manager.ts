import { Response } from "express";
import { constants } from "../common/constants";
import { IResponseObj } from "../common/interface";
import { responseCode } from "../common/response";
import utils from "../common/utils";
import { performSingleDBOperation } from "../db/db";
import driverSocketHelper from "../helper/driverSocket.helper";
import rideHelper from "../helper/ride.helper";
import { Server } from "socket.io";
import { eventTags } from "../common/eventTags";
import { getIO } from "../service/socketConfig.service";
import driverManager from "./driver.manager";

const managerRiderRideRequest = async (body: any) => {
    const io = getIO();
    try {
        const rideResponseObj: IResponseObj = await rideHelper.handleRideRequest(body);
        let rideRequestId: string = constants.BLANK;
    
        if(rideResponseObj.responseCode !== responseCode.SUCCESS) {
            return io.emit(eventTags.RIDER_ERROR, rideResponseObj);
        }
                
        if(rideResponseObj.dbObject) {
            const [result] = await performSingleDBOperation(rideResponseObj.dbObject);
            rideRequestId = result._id;
        }

        const driverResponseObj: any = await rideHelper.sendRequestToDrivers(body, rideRequestId);

        if(driverResponseObj.responseCode !== responseCode.SUCCESS) {
            return io.emit(eventTags.RIDER_ERROR, rideResponseObj);
        }

        if(driverResponseObj.dbObject) {
            await performSingleDBOperation(driverResponseObj.dbObject);
            await driverManager.pushRideRequestToDriver(driverResponseObj.rideRequestList);
        }
        
    } catch (error) {
        throw error
    }
}

export default {
    managerRiderRideRequest,
};