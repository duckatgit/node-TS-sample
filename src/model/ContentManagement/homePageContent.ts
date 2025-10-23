import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHomePageContent extends Document {
	heading: string;
	description: string;
	closingLine: string;
	LuxuryExperience: {
		title: string;
		description: string;
		video: string;
	};
	safetyHighlight: {
		heading: string;
		subHeading: string;
		title: string;
		description: string;
		image: string;
	};
	explore: {
		heading: string;
		description: string;
	};
	userId: Types.ObjectId
}

const HomePageContentSchema = new Schema<IHomePageContent>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	heading: { type: String, required: true },
	description: { type: String, required: true },
	closingLine: { type: String, required: true },
	LuxuryExperience: {
		title: { type: String, required: true },
		description: { type: String, required: true },
		video: { type: String, required: true },
	},
	safetyHighlight: {
		heading: { type: String, required: true },
		subHeading: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		image: { type: String },
	},
	explore: {
		heading: { type: String, required: true },
		description: { type: String, required: true },
	},
});

const HomePageContent = mongoose.model<IHomePageContent>(
	"HomePageContent",
	HomePageContentSchema
);

export default HomePageContent;
