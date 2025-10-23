import mongoose, { Schema, Document, Model } from "mongoose";

export enum IStatus {
    INITIATE = 100,
    PAID = 200,
    FAILED = 201,
    REFUNDED = 202,
}


export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  rideId?: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amount: number;
  currency: string;
  status: number;
  paymentMethod: string;
  description?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rideId: { type: Schema.Types.ObjectId, ref: "Ride" },

    stripePaymentIntentId: { type: String, required: true, unique: true },
    stripeChargeId: { type: String },

    amount: { type: Number, required: true }, 
    currency: { type: String, default: "usd" },

    status: {
      type: Number,
      enum: IStatus,
      default: IStatus.INITIATE,
    },

    paymentMethod: { type: String, default: "card" },
    description: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> = mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;
