import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISecurityItem {
	imageUrl: string;
	label: string;
}

export interface ISecurityDisclaimer extends Document {
	title: string;
	description: string;
	items: ISecurityItem[];
	createdAt?: Date;
	updatedAt?: Date;
}

const securityItemSchema = new Schema<ISecurityItem>({
	imageUrl: { type: String, required: true },
	label: { type: String, required: true },
});

const securityDisclaimerSchema = new Schema<ISecurityDisclaimer>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		items: { type: [securityItemSchema], default: [] },
	},
	{ timestamps: true }
);

const SecurityDisclaimer = mongoose.model<ISecurityDisclaimer>(
	"SecurityDisclaimer",
	securityDisclaimerSchema
);

export default SecurityDisclaimer;
