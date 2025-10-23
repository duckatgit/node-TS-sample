import { Schema, model, Types } from "mongoose";
import { constants, documentFileKeys } from "../common/constants";

export interface IVehicleDocument {
  userId: Types.ObjectId;    
  vehicleId: Types.ObjectId;
  documentUrl: string;
  documentType: typeof documentFileKeys.VEHICLE_RC | typeof documentFileKeys.VEHICLE_INSURANCE | typeof constants.OTHER;
  createdAt?: Date;
  updatedAt?: Date;
}

const vehicleDocumentSchema = new Schema<IVehicleDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    documentUrl: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: [documentFileKeys.VEHICLE_RC, documentFileKeys.VEHICLE_INSURANCE, constants.OTHER],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const VehicleDocument = model<IVehicleDocument>("VehicleDocument", vehicleDocumentSchema);
