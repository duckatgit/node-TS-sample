import { Schema, model, Types } from "mongoose";
import { constants, documentFileKeys } from "../common/constants"; // adjust path

export interface IUserDocument {
  userId: Types.ObjectId;
  documentUrl: string;
  documentType: typeof documentFileKeys.DRIVER_LICENCE | typeof documentFileKeys.ID_PROOF | typeof constants.OTHER;
  createdAt: Date;
  updatedAt: Date;
}

const userDocumentSchema = new Schema<IUserDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    documentUrl: { type: String, required: true, trim: true },
    documentType: {
      type: String,
      enum: [documentFileKeys.DRIVER_LICENCE, documentFileKeys.ID_PROOF, constants.OTHER],
      required: true,
    },
  },
  {
    timestamps: true
  }
);

export const UserDocument = model<IUserDocument>("UserDocument", userDocumentSchema);
