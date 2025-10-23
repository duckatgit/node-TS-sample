import mongoose, { Schema, Document } from "mongoose";

const CardItemSchema = new Schema(
	{
		icon: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ _id: false }
);

const FounderSchema = new Schema(
	{
		heading: { type: String, required: true },
		title: { type: String, required: true },
		name: { type: String, required: true },
		designation: { type: String },
		image: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ _id: false }
);

const PromiseSchema = new Schema(
	{
		heading: { type: String, required: true },
		title: { type: String, required: true },
		subtitle: { type: String },
		items: { type: [CardItemSchema], required: true },
	},
	{ _id: false }
);

const MissionVisionSchema = new Schema(
	{
		heading: { type: String, required: true },
		mission: {
			title: { type: String, required: true },
			description: { type: String, required: true },
			image: { type: String, required: true },
		},
		vision: {
			title: { type: String, required: true },
			description: { type: String, required: true },
			image: { type: String, required: true },
		},
	},
	{ _id: false }
);

export interface IAboutUs extends Document {
	founder: {
		heading: string;
		title: string;
		name: string;
		designation?: string;
		image: string;
		description: string;
	};
	promise: {
		heading: string;
		title: string;
		subtitle?: string;
		items: {
			icon: string;
			title: string;
			description: string;
		}[];
	};
	missionVision: {
		heading: string;
		mission: { title: string; description: string; image: string };
		vision: { title: string; description: string; image: string };
	};
	createdAt: Date;
	updatedAt: Date;
}

const AboutUsSchema: Schema<IAboutUs> = new Schema(
	{
		founder: { type: FounderSchema, required: true },
		promise: { type: PromiseSchema, required: true },
		missionVision: { type: MissionVisionSchema, required: true },
	},
	{ timestamps: true }
);

const AboutUs = mongoose.model<IAboutUs>("AboutUs", AboutUsSchema);

export default AboutUs;
