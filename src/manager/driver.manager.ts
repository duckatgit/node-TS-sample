import { Server } from "socket.io";
import { constants, redisKeys } from "../common/constants";
import { eventTags } from "../common/eventTags";
import { DbOperationObject, DriverLocationData } from "../common/interface";
import utils from "../common/utils";
import { performSingleDBOperation } from "../db/db";
import driverSocketHelper from "../helper/driverSocket.helper";
import { rideModel } from "../model";
import { RideStatus } from "../model/ride.model";
import { getIO } from "../service/socketConfig.service"; 
import redisService from "../service/redis.service";
import logger from "../service/logger";

const updateDriverLocationAndStatus = async (data: DriverLocationData) => {
    const { driverId, latitude, longitude, online, free } = data;

    if (online === false) {
    await driverSocketHelper.updateDriverStatus(driverId, false, constants.FALSE);
    }

    await driverSocketHelper.updateDriverGeo(driverId, latitude, longitude);

    await driverSocketHelper.updateDriverStatus(driverId, true, free);
}

const acceptRideRequest = async (rideId: string, driverId: string) => {
    const io: Server = getIO();
    const requiredFields: any = [ 'rideId', 'driverId' ];

    const validateObj = utils.validateFields({rideId, driverId}, requiredFields);
        
    if(validateObj.valid === false) {
        throw new Error(validateObj.message);   
    }
    
    
    // Atomic assignment: only assign if ride is still REQUESTED
    const dbObj: DbOperationObject = {
        type: constants.UPDATE,
        model: rideModel,
        query: { _id: rideId, status: RideStatus.REQUESTED }, 
        update: { $set: { status: RideStatus.ACCEPTED, driverId } },
    }

    const [ride] = await performSingleDBOperation(dbObj);

    
    if (!ride) {
        // Ride already accepted by someone else
        return io.emit(eventTags.RIDE_ALREADY_TAKEN, { rideId });
    }

    const rideObj = ride.toJSON();
    
    // Update rideRequests status
    ride.rideRequests.forEach((req: any) => {
        if (req.driverId.toString() === driverId) req.status = RideStatus.ACCEPTED;
        else req.status = RideStatus.CANCELLED;
    });
    
    const rideRequestDBObj: DbOperationObject = {
        type: constants.UPDATE,
        model: rideModel,
        query: { _id: rideId}, 
        update: { $set: ride },
    }
    
    const [newRide] = await performSingleDBOperation(rideRequestDBObj);

    // Notify this driver
        io.to(driverId).emit(eventTags.RIDE_ASSIGNED, { newRide });
    
    // Notify other drivers that ride is taken
    ride.rideRequests
        .filter((req: any) => {req.driverId.toString() !== driverId})
        .forEach((req: any) => {io.to(req.driverId.toString()).emit(eventTags.RIDE_CANCELLED, { rideId })});
    
    io.to(rideObj.userId.toString()).emit(eventTags.RIDER_RIDE_ACCEPTED, { newRide });
}

const pushRideRequestToDriver = async (document: any) => {
  const io = getIO();

  for (const doc of document) {

    const {
      rideId,
      driverId,
      pickUpAddress,
      pickUpLatitude,
      pickUpLongitude,
      dropAddress,
      dropLatitude,
      dropLongitude,
      distanceKm,
    } = doc;
    
    const driverStatus = await redisService.hget(redisKeys.DRIVER_STATUS, driverId);
  
    if (!driverStatus || !driverStatus.online) {
      logger.info(`[pushRideRequest] Driver ${driverId} is offline, skipping push`);
      return false;
    }
  
    const pickup: any = {
      address: pickUpAddress, 
      latitude: pickUpLatitude, 
      longitude: pickUpLongitude,
    }
    const drop: any = {
      address: dropAddress, 
      latitude: dropLatitude, 
      longitude: dropLongitude,
    }
  
    io.to(driverId).emit(eventTags.DRIVER_NEW_RIDE_REQUEST, {
      rideId: rideId,
      pickup: pickup,
      drop: drop,
      // fareEstimate: rideData.fareEstimate,
      distanceKm: distanceKm,
      // durationMin: rideData.durationMin,
      expiresInSec: constants.RIDE_REQUEST_EXPIRE_SECOND, 
    });
    
    logger.info(`[pushRideRequest] Ride ${rideId} pushed to driver ${driverId}`);
    
  }

}

export default {
    updateDriverLocationAndStatus,
    acceptRideRequest,
    pushRideRequestToDriver,
};