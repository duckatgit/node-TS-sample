import mongoose, { Schema, Document, Model } from "mongoose";

export enum IReason {
    CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    RIDE_CANCELLED = 'RIDE_CANCELLED',
    OTHER = 'OTHER'
}

export enum IStatus {
    PENDING = 100,
    SUCCESS = 200,
    FAILED = 201
}

export interface IRefund extends Document {
  paymentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  stripeRefundId: string;
  amount: number;
  reason?: IReason;
  status: IStatus;
  refundResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const refundSchema: Schema<IRefund> = new Schema(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    stripeRefundId: { type: String, required: true, unique: true },

    amount: { type: Number, required: true },

    reason: {
      type: String,
      enum: Object.values(IReason),
      default: 'OTHER',
    },

    status: {
      type: Number,
      enum: IStatus,
      default: IStatus.PENDING,
    },

    refundResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Refund: Model<IRefund> = mongoose.model<IRefund>("Refund", refundSchema);

export default Refund;
