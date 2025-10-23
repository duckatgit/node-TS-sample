import mongoose, { Schema, Document, Model } from 'mongoose';
import { constants } from '../common/constants';

// Enums for payment method and status
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  UPI = 'UPI',
}

export enum PaymentStatus {
  INITIATE = 100,
  PAID = 200,
  FAILED = 201,
  REFUNDED = 202
}

// Interface for TypeScript
export interface IRideFare extends Document {
  rideId: mongoose.Types.ObjectId; // Reference to the ride
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  totalFare: number;
  discountAmount?: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Schema definition
const rideFareSchema = new Schema<IRideFare>(
  {
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },

    baseFare: { type: Number, required: true },
    distanceFare: { type: Number, required: true },
    timeFare: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1 }, // default no surge
    totalFare: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    paymentStatus: {
      type: Number,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.INITIATE,
      required: true,
    },

    transactionId: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for quick lookup by ride
// rideFareSchema.index({ rideId: 1 });

export const RideFare: Model<IRideFare> =
  mongoose.models.RideFare || mongoose.model<IRideFare>('RideFare', rideFareSchema);
