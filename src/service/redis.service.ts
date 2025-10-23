import Redis from 'ioredis';
import environment from '../config/environment';
import { constants } from '../common/constants';

const host: string = environment.REDIS_HOST || '127.0.0.1';
const port: number = Number(environment.REDIS_PORT) || 6379;

const redis = new Redis({ host: host, port: port, })

const hset = async (key: string, driverId: string, value: string) => {
    await redis.hset(key, driverId, value);
};

const hdel = async (key: string, driverId: string) => {
    await redis.hdel(key, driverId);
};

const hget = async (key: string, driverId: string) => {
    const value = await redis.hget(key, driverId);
    return value ? JSON.parse(value) : null;
};

const hgetall = async (key: string) => {
    const data = await redis.hgetall(key);
    const result: Record<string, any> = {};
    for (const driverId in data) {
        result[driverId] = JSON.parse(data[driverId]);
    }
    return result;
};

const addGeoLocation = async (key: string, longitude: string, latitude: string, driverId: string) => {
    await redis.geoadd(key, parseFloat(longitude), parseFloat(latitude), driverId);
};

const removeGeoLocation = async (key: string, driverId: string) => {
    await redis.zrem(key, driverId);
}

const getNearbyDrivers= async (geoKey: string, latitude: string, longitude: string) => {
    const nearby = await redis.georadius(
      geoKey,
      parseFloat(longitude),
      parseFloat(latitude),
      constants.KM_RADIUS_DRIVER,
      'km',
      'WITHDIST'
    );

    return (nearby as [string, string][]).map(([driverId, distance]) => ({
        driverId,
        distance: parseFloat(distance),
    }));
  }


export default {
    redis,
    addGeoLocation,
    removeGeoLocation,
    getNearbyDrivers,
    hset,
    hdel,
    hget,
    hgetall
}