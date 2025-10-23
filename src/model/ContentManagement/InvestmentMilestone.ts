import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMilestone {
	label: string;
	year: string;
}

export interface IInvestmentMilestone extends Document {
	userId: Types.ObjectId;
	milestones: IMilestone[];
	createdAt?: Date;
	updatedAt?: Date;
}

const milestoneSchema = new Schema<IMilestone>(
	{
		label: { type: String, required: true },
		year: { type: String, required: true },
	},
	{ _id: false }
);

const InvestmentMilestoneSchema = new Schema<IInvestmentMilestone>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		milestones: {
			type: [milestoneSchema],
			required: true,
		},
	},
	{ timestamps: true }
);

const InvestmentMilestone = mongoose.model<IInvestmentMilestone>(
	"InvestmentMilestone",
	InvestmentMilestoneSchema
);

export default InvestmentMilestone;
