import bcrypt from "bcryptjs";
import mongoose, { Schema, model, Document, Model } from "mongoose";

export enum DriverType {
	REYA_FEMALE = "Female",
	GUARDIAN_TRACK = "Male",
}

export enum UserType {
	DRIVER = "DRIVER",
	RIDER = "RIDER",
	INVESTOR = "INVESTOR",
}

export enum Subscription {
	ESSENTIAL = "Essential",
	LUXE = "Luxe",
	ELITE = "Elite",
}

export enum InvestementTier {
	Bronze = "Bronze",
	Silver = "Silver",
	Gold = "Gold",
	Platinum = "Platinum",
	Diamond = "Diamond",
	FounderDiamondBronze = "Founders",
}

export interface ILeadDriverRider extends Document {
	fullName?: string;
	firstName?: string;
	lastName?: string;
	phoneNumber: string;
	password: string;
	email: string;

	language?: string;
	city?: string;
	countryResidence?: string;

	drivingLicenseNumber: string | undefined;
	driverType: DriverType;

	amount?: number;
	message?: string;
	investmentTier?: InvestementTier;

	role: UserType;
	subscriptionPlan: Subscription;

	insurance: string;
	vehicleRegistration: string;
	drivingLicenseImage: string;
	trainingCertificate: string;
	
	confirm: boolean;
	founderClub: boolean;
	daycareProgram: boolean;
	guardianCertification: boolean;
	isVerified: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const LeadDriverRiderSchema = new Schema<ILeadDriverRider>(
	{
		fullName: {
			type: String,
			trim: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: [true, "Phone number is required"],
			match: [/^\+?\d{7,15}$/, "Invalid phone number format"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
		},
		role: {
			type: String,
			enum: Object.values(UserType),
			default: null,
		},
		language: {
			type: String,
			trim: true,
		},
		city: {
			type: String,
			trim: true,
		},
		countryResidence: {
			type: String,

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
			default: null,
		},
		message: {
			type: String,
			default: null,
			trim: true,
		},
		drivingLicenseNumber: {
			type: String,
			trim: true,
		},
		drivingLicenseImage: {
			type: String,
		},
		trainingCertificate: {
			type: String,
		},
		insurance: {
			type: String,
		},
		vehicleRegistration: {
			type: String,
		},
		driverType: {
			type: String,
			enum: Object.values(DriverType),
			default: null,
		},

		subscriptionPlan: {
			type: String,
			enum: Object.values(Subscription),
			default: null,
		},
		founderClub: {
			type: Boolean,
			default: false,
		},
		daycareProgram: {
			type: Boolean,
			default: false,
		},
		guardianCertification: {
			type: Boolean,
			default: false,
		},

		confirm: {
			type: Boolean,
			default: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

LeadDriverRiderSchema.pre<ILeadDriverRider>("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

LeadDriverRiderSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

const LeadDriverRider: Model<ILeadDriverRider> =
	mongoose.model<ILeadDriverRider>("LeadDriverRider", LeadDriverRiderSchema);

export default LeadDriverRider;
