import mongoose, { Document, Schema, Model } from "mongoose";

export enum InquiryType {
	General = "General",
	Investor = "Investor",
	Partnerships = "Investor",
	Careers = "Careers",
	Partnership = "Partnership",
}

export interface IContactForm extends Document {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	inquiry: InquiryType;
	message?: string;
	agree: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const ContactFormSchema: Schema<IContactForm> = new Schema(
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
		inquiry: {
			type: String,
			enum: Object.values(InquiryType),
			required: [true, "Inquiry type is required"],
		},
		message: { type: String, trim: true },
		agree: { type: Boolean, required: [true, "You must agree to terms"] },
	},
	{ timestamps: true }
);

const ContactUs: Model<IContactForm> = mongoose.model<IContactForm>(
	"ContactUs",
	ContactFormSchema
);

export default ContactUs;
