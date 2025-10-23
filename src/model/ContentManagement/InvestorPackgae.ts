import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvestorTier {
	title: string;
	amount: string;
	subtitle: string;
	equity: string;
	roi: string;
	benefits: string[];
}

export interface IInvestorPackage extends Document {
	userId: Types.ObjectId;
	heading: string;
	title: string;
	amount: string;
	subtitle: string;
	equity: string;
	roi: string;
	benefits: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

const investorPackageSchema = new Schema<IInvestorPackage>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		heading: { type: String, required: true },
		title: { type: String, required: true },
		amount: { type: String, required: true },
		subtitle: { type: String, required: true },
		equity: { type: String, required: true },
		roi: { type: String, required: true },
		benefits: { type: [String], required: true },
	},
	{ timestamps: true }
);

const InvestorPackage = mongoose.model<IInvestorPackage>(
	"InvestorPackage",
	investorPackageSchema
);

export default InvestorPackage;
