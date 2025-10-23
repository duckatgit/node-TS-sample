import { constants, redisKeys } from "../common/constants";
import { eventTags } from "../common/eventTags";
import logger from "../service/logger";
import redisService from "../service/redis.service";
import { getIO } from "../service/socketConfig.service";

const DRIVER_LOCATION_KEY = redisKeys.DRIVER_LOCATION;
const DRIVER_STATUS_KEY = redisKeys.DRIVER_STATUS;

const updateDriverGeo = async (driverId: string, latitude: string, longitude: string) => {
  await redisService.addGeoLocation(DRIVER_LOCATION_KEY, longitude, latitude, driverId);
}

const updateDriverStatus = async (driverId: string, online: boolean, free: number = constants.TRUE) => {
  if (!online) {
    // If offline, remove from GEO and status
    await redisService.removeGeoLocation(DRIVER_LOCATION_KEY, driverId);
    await redisService.hdel(DRIVER_STATUS_KEY, driverId);
    return;
  }

  await redisService.hset(DRIVER_STATUS_KEY, driverId, JSON.stringify({ free, online }));
}





export default {
  updateDriverGeo,
  updateDriverStatus
}