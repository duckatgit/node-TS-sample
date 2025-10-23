import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriptionPlan extends Document {
	name: string;
	price: string;
	period: "monthly" | "yearly";
	features: string[];
	discount?: number;
	freeRideCredits?: number;
	badge?: string;
	metadata?: any;
}

const SubscriptionPlanSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
		price: { type: Number, required: true },
		period: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
		features: { type: [String], required: true },
		discount: { type: Number, default: 0 },
		freeRideCredits: { type: Number, default: 0 },
		badge: { type: String },
		matadata: { type: Object},
	},
	{ timestamps: true }
);

const SubscriptionPlan: Model<ISubscriptionPlan> =
	mongoose.model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);

export default SubscriptionPlan;
