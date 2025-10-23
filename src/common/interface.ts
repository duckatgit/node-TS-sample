import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { constants } from "./constants";


export interface DbOperationObject {
  type: typeof constants.UPDATE | typeof constants.INSERT;
  model: Model<any>;
  query?: FilterQuery<any>;
  update?: UpdateQuery<any>;
  doc?: Partial<any>;
}

export interface IResponseObj {
  responseCode: number,
  responseMsg: string,
  dbObject?: DbOperationObject,
  dbObjList?:DbOperationObject[]
}

export interface DriverLocationData {
  driverId: string;
  latitude: string;
  longitude: string;
  online?: boolean;
  free?: number;
}

export interface RidePushData {
  rideId: string;
  pickUpAddress: string;
  pickUpLatitude: string;
  pickUpLongitude: string;
  dropAddress: string;
  dropLatitude: string;
  dropLongitude: string;
  // fareEstimate?: number;
  distanceKm?: number;
  // durationMin?: number;
  expiresInSec?: number; // optional
}