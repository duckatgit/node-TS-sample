import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFeature extends Document {
	userId: Types.ObjectId;
	heading: string;
	title: string;
	features: string[];
	description: string;
	image: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const FeatureSchema: Schema<IFeature> = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		heading: { type: String, required: [true, "Heading is required"] },
		title: { type: String, required: [true, "Title is required"] },
		features: { type: [String], required: [true, "Points are required"] },
		description: { type: String, required: [true, "Description is required"] },
		image: { type: String, required: [true, "Image is required"] },
	},
	{ timestamps: true }
);

const HomePageFeature: Model<IFeature> = mongoose.model<IFeature>(
	"HomePageFeature",
	FeatureSchema
);

export default HomePageFeature;
