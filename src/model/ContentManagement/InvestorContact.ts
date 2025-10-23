import mongoose, { Document, Schema, Model } from "mongoose";

export enum InvestementTier {
	Bronze = "Bronze",
	Silver = "Silver",
	Gold = "Gold",
	Platinum = "Platinum",
	Diamond = "Diamond",
	FounderDiamondBronze = "Founders",
}

export interface IInvestorForm extends Document {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	countryResidence: string;
	amount: number;
	investmentTier: InvestementTier;
	message?: string;
	agree: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const InvestorFormSchema: Schema<IInvestorForm> = new Schema(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			trim: true,
		},
		countryResidence: {
			type: String,
			required: [true, "Country is required"],
			trim: true,
		},
		amount: {
			type: Number,
			default: 0,
			trim: true,
		},
		investmentTier: {
			type: String,
			enum: Object.values(InvestementTier),
			required: [true, "Investment Tier is required"],
		},
		message: { type: String, default: null, trim: true },
		agree: { type: Boolean, required: [true, "You must agree to terms"] },
	},
	{ timestamps: true }
);

const InvestorContact: Model<IInvestorForm> = mongoose.model<IInvestorForm>(
	"InvestorContact",
	InvestorFormSchema
);

export default InvestorContact;
