import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICompanyValue extends Document {
	userId: Types.ObjectId;
	title: string;
	description: string;
	image: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const CompanyValueSchema: Schema<ICompanyValue> = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: [true, "Title is required"] },
		description: { type: String, required: [true, "Description is required"] },
		image: { type: String, required: [true, "Image is required"] },
	},
	{ timestamps: true }
);

const HomeCompanyValue: Model<ICompanyValue> = mongoose.model<ICompanyValue>(
	"HomeCompanyValue",
	CompanyValueSchema
);

export default HomeCompanyValue;
