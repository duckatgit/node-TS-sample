import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { constants } from '../common/constants';

// Enums for allowed values
export enum RideStatus {
  REQUESTED = constants.REQUESTED,
  ACCEPTED = constants.ACCEPTED,
  ARRIVED = constants.ARRIVED,
  STARTED = constants.STARTED,
  COMPLETED = constants.COMPLETED,
  CANCELLED = constants.CANCELLED,
  NO_SHOW = constants.NO_SHOW,
}

export enum CancelledBy {
  USER = 'USER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export interface IRideRequest {
  rideId: Types.ObjectId | string;
  driverId: Types.ObjectId | string;
  status: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Ride document interface
export interface IRide extends Document {
  userId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  vehicleId?: mongoose.Types.ObjectId;

  pickUpAddress: string;
  pickUpLatitude: number;
  pickUpLongitude: number;

  dropAddress: string;
  dropLatitude: number;
  dropLongitude: number;

  routeDistanceKM?: number;
  routeDurationMin?: number;

  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  cancelledAt?: Date;

  status: RideStatus;
  cancelledBy?: CancelledBy;
  cancellationReason?: string;

  rideRequests?: IRideRequest[];

  createdAt?: Date;
  updatedAt?: Date;
}

// Schema definition
const rideSchema = new Schema<IRide>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },

    pickUpAddress: { type: String, required: true },
    pickUpLatitude: { type: Number, required: true },
    pickUpLongitude: { type: Number, required: true },

    dropAddress: { type: String, required: true },
    dropLatitude: { type: Number, required: true },
    dropLongitude: { type: Number, required: true },

    routeDistanceKM: { type: Number },
    routeDurationMin: { type: Number },

    scheduledAt: { type: Date },
    startedAt: { type: Date },
    endedAt: { type: Date },
    cancelledAt: { type: Date },

    status: {
      type: Number,
      enum: [
        constants.REQUESTED,
        constants.ACCEPTED,
        constants.ARRIVED,
        constants.STARTED,
        constants.COMPLETED,
        constants.CANCELLED,
        constants.NO_SHOW,
      ],
      required: true,
    },

    cancelledBy: {
      type: String,
      enum: Object.values(CancelledBy),
      default: null,
    },

    cancellationReason: { type: String },

    rideRequests: [
      {
        rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
        driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
        status: {
          type: Number,
          enum: [
            constants.REQUESTED,
            constants.ACCEPTED,
            constants.ARRIVED,
            constants.STARTED,
            constants.COMPLETED,
            constants.CANCELLED,
            constants.NO_SHOW,
          ],
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
// rideSchema.index({ userId: 1 });
// rideSchema.index({ driverId: 1 });
// rideSchema.index({ status: 1 });
// rideSchema.index({ pickupLat: 1, pickupLng: 1 });
// rideSchema.index({ dropoffLat: 1, dropoffLng: 1 });

// Model type
export const Ride: Model<IRide> =
  mongoose.models.Ride || mongoose.model<IRide>('Ride', rideSchema);
