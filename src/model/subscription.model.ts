import { CANCELLED } from "dns";
import mongoose, { Schema, Document, Model } from "mongoose";

export enum IStatus {
    INITIATE = 100,
    ACTIVE = 200,
    PAST_DUE = 201,
    CANCELLED = 202,
    UNPAID = 203,
}

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripCustomerId: string;
  subscriptionPlanId: string;
  stripeSubscriptionId: string;
  status: IStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema: Schema<ISubscription> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripCustomerId: { type: String, required: true },
    subscriptionPlanId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    status: {
      type: Number,
      enum: IStatus,
      default: IStatus.INITIATE,
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;
