import { Schema, model, Types } from "mongoose";

export interface IForgotPassword {
  userId: Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  attemptsLeft?: number;
  used?: boolean;
}

const forgotPasswordSchema = new Schema<IForgotPassword>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "userId is required"] },
    otpHash: { type: String, required: [true, "otpHash is required"] },
    expiresAt: { type: Date, required: [true, "expiresAt is required"] },
    attemptsLeft: { type: Number, default: 5 },
    used: { type: Boolean, default: false }
  },
  {
    timestamps: false,
  }
);

// TTL indexes for automatic cleanup
forgotPasswordSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
forgotPasswordSchema.index({ reset_token_expires_at: 1 }, { expireAfterSeconds: 0 });

export const ForgotPassword = model<IForgotPassword>("ForgotPassword", forgotPasswordSchema);
