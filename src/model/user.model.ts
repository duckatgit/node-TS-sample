import { Schema, Document, Model, model } from "mongoose";
import bcrypt from "bcryptjs";
import { constants } from "../common/constants";

export interface IUser extends Document {
    name: string;
    phoneNo: string
    email: string;
    gender: string;
    password: string;
    role: "RIDER" | "ADMIN" | "DRIVER" | "INVESTOR";
    profilePic: string;
    userReferralCode: string;
    appliedReferralCode: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {type: String,required: true,trim: true, },
    email: { type: String,  lowercase: true, trim: true, },
    phoneNo: { type: String, trim: true, },
    gender: { type: String },
    password: { type: String, required: true, },
    profilePic: { type: String },
    userReferralCode: { type: String },
    appliedReferralCode: { type: String },
    isActive: { type: Boolean, default: true, },
    isVerified: { type: Boolean, default: false, },
    role: { type: String, required: true, enum: [constants.ADMIN, constants.RIDER, constants.DRIVER, constants.INVESTOR], default: constants.RIDER, },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
