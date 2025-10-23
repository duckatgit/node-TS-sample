import { constants, redisKeys } from "../common/constants";
import { IResponseObj } from "../common/interface";
import { responseCode, responseMsg } from "../common/response";
import utils from "../common/utils";
import { rideModel } from "../model/index";
import userRepository from "../repository/user.repository";
import redisService from "../service/redis.service";

const handleRideRequest = async (body: any) => {
    const {userId,
        pickUpAddress,
        pickUpLatitude,
        pickUpLongitude,
        dropAddress,
        dropLatitude,
        dropLongitude,
        distanceKm
        } = body;
    const requiredFields = [
        'userId',
        'latitude',
        'longitude',
        'pickUpAddress',
        'pickUpLatitude',
        'pickUpLongitude',
        'dropAddress',
        'dropLatitude',
        'dropLongitude',
        'distanceKm'
    ];
    let responseObj:IResponseObj = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };

    const validateObj = utils.validateFields(body, requiredFields);
    
    if(validateObj.valid === false) {
        responseObj.responseCode = responseCode.BAD_REQUEST;
        responseObj.responseMsg = validateObj.message;

        return responseObj; 
    }

    const existingUser = await userRepository.findUser({ id: userId, isActive:true });
    
    if (!existingUser) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_FOUND;

        return responseObj;
    }

    

    responseObj.dbObject = {
        type: constants.INSERT,
        model: rideModel,
        doc: {
            userId,
            pickUpAddress,
            pickUpLatitude,
            pickUpLongitude,
            dropAddress,
            dropLatitude,
            dropLongitude,
            routeDistanceKM: distanceKm,
            status: constants.REQUESTED
        }
    }

    return responseObj
}

const sendRequestToDrivers = async (body: any, rideRequestId: string) => {
    const {userId,
        latitude,
        longitude,
        pickUpAddress,
        pickUpLatitude,
        pickUpLongitude,
        dropAddress,
        dropLatitude,
        dropLongitude,
        distanceKm
        } = body;

    let responseObj:any = {
        responseCode: responseCode.SUCCESS,
        responseMsg: responseMsg.SUCCESS,
    };


    const availableDriverList = await redisService.getNearbyDrivers(redisKeys.DRIVER_LOCATION, latitude, longitude);

    if(availableDriverList.length <= constants.FALSE) {
        responseObj.responseCode = responseCode.NOT_FOUND;
        responseObj.responseMsg = responseMsg.USER_NOT_IN_AREA;

        return responseObj;
    }

    const rideRequestList: any = [];

    availableDriverList.forEach((driverObj: any)=>{

        rideRequestList.push(
            {
                rideId: rideRequestId,
                userId,
                driverId: driverObj.driverId,
                pickUpAddress,
                pickUpLatitude,
                pickUpLongitude,
                dropAddress,
                dropLatitude,
                dropLongitude,
                status:constants.REQUESTED,
                distanceKm
            }
        )

    })

    responseObj.dbObject = {
        type: constants.UPDATE,
        model: rideModel,
        query: { _id: rideRequestId }, 
        update: { $set: {rideRequests: rideRequestList}}
    }

    responseObj.rideRequestList = rideRequestList;

    return responseObj
}


export default {
    handleRideRequest,
    sendRequestToDrivers
}