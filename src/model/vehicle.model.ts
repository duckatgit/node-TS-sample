import { Schema, model, Types } from "mongoose";
import { constants } from "../common/constants";


export interface IVehicle {
  userId: Types.ObjectId;
  vehicleNo: string;
  vehicleType?: string;
  isActive?: number;
  isVerified?: number;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicleNo: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    vehicleType: { type: String, trim: true },
    isActive: { type: Number, default: constants.TRUE },
    isVerified: { type: Number, default: constants.FALSE },
  },
  {
    timestamps: true
  }
);

export const Vehicle = model<IVehicle>("Vehicle", vehicleSchema);
