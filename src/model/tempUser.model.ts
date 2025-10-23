import { Schema, model, Document } from "mongoose";
import { constants, documentFileKeys } from "../common/constants";


export interface ITempUserDocument {
  documentUrl: string;
  documentType: typeof documentFileKeys.DRIVER_LICENCE | typeof documentFileKeys.ID_PROOF | typeof constants.OTHER;
}

export interface ITempVehicleDocument {
  documentUrl: string;
  documentType: typeof documentFileKeys.VEHICLE_RC | typeof documentFileKeys.VEHICLE_INSURANCE | typeof constants.OTHER; 
}

export interface ITempUser extends Document {
    // User Details
    name: string;
    email: string;
    phoneNo: string;
    gender: string;
    password: string;
    profilePic: string;
    userReferralCode: string;
    appliedReferralCode: string;
    role: "USER" | "ADMIN" | "DRIVER";
    stage: number;
    stageLocked: boolean;

    // Vehicle Details
    vehicleNo: string;
    vehicleType: string;

    // User and Vehicle Documents
    userDocuments: ITempUserDocument[];
    vehicleDocuments: ITempVehicleDocument[];

    // UserBank Stage
    accountHolderName: string;
    accountNumber: string;
    sortCode: string;

    createdAt: Date;
    updatedAt: Date;
}

// Subschemas for documents

const TempUserDocumentSchema = new Schema<ITempUserDocument>(
  {
    documentUrl: { type: String, required: true },
    documentType: {
      type: String,
      enum: [documentFileKeys.DRIVER_LICENCE, documentFileKeys.ID_PROOF, constants.OTHER],
      required: true,
    },
  },
  { _id: false }
);

const TempVehicleDocumentSchema = new Schema<ITempVehicleDocument>(
  {
    documentUrl: { type: String, required: true },
    documentType: {
      type: String,
      enum: [documentFileKeys.VEHICLE_RC, documentFileKeys.VEHICLE_INSURANCE, constants.OTHER],
      required: true,
    },
  },
  { _id: false }
);

// 2️⃣ Create Mongoose Schema
const TempUserSchema = new Schema<ITempUser>(
  {
    // User Details
    name: { type: String, required: true },
    email: { type: String },
    phoneNo: { type: String },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    userReferralCode: { type: String },
    appliedReferralCode: { type: String },
    role: { type: String, enum: [constants.ADMIN, constants.USER, constants.DRIVER], default: constants.USER },
    stage: { type: Number, default: 0 },
    stageLocked: { type: Boolean, default: false },

    // Vehicle Details
    vehicleNo: { type: String },
    vehicleType: { type: String },

    // User and Vehicle Documents
    userDocuments: { type: [TempUserDocumentSchema], default: [] },
    vehicleDocuments: { type: [TempVehicleDocumentSchema], default: [] },
    

    // User Bank Details
    accountHolderName: { type: String, trim: true, minlength: 2, maxlength: 100 },
    accountNumber: { type: String, trim: true, maxlength: 50 },
    sortCode: { type: String, trim: true },
  },
  {
    timestamps: true, // automatically manages createdAt & updatedAt
  }
);

// 3️⃣ Create Mongoose Model
export const TempUser = model<ITempUser>("TempUser", TempUserSchema);

// Field Schemas
export const userObjFields: (keyof ITempUser)[] = ['_id', 'name', 'email', 'phoneNo', 'gender', 'userReferralCode', 'appliedReferralCode', 'role', 'profilePic'];
export const vehicleObjFields: (keyof ITempUser)[] = ['vehicleNo', 'vehicleType'];
export const bankObjFields: (keyof ITempUser)[] = ['accountNumber', 'accountHolderName', 'sortCode'];
