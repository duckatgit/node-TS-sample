import { Schema, model, Document, Types } from "mongoose";

export interface IUserBank extends Document {
  userId: Types.ObjectId;
  accountHolderName: string;
  accountNumber: string;
  sortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const userBankSchema = new Schema<IUserBank>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    accountHolderName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    accountNumber: { type: String, required: true, trim: true, maxlength: 50 },
    sortCode: { type: String, required: true, trim: true },
  },
  {
    timestamps: true
  }
);

export const UserBank = model<IUserBank>("UserBank", userBankSchema);



