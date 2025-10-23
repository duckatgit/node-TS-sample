import mongoose, { Schema, Document, Model } from "mongoose";

export enum HeaderEnum {
	HOME = "home",
	ABOUT = "about",
	INVESTORS = "investors",
	DRIVERS = "drivers",
	SAFETY = "safety",
	CONTACT = "contact",
}

export interface IHeaderContent extends Document {
	section: HeaderEnum;
	heading: string;
	subHeading: string;
	banner: string;
	createdAt: Date;
	updatedAt: Date;
}

const HeaderContentSchema: Schema<IHeaderContent> = new Schema(
	{
		section: {
			type: String,
			enum: Object.values(HeaderEnum),
			required: true,
			unique: true,
		},
		heading: {
			type: String,
			required: true,
			trim: true,
		},
		subHeading: {
			type: String,
			required: true,
			trim: true,
		},
		banner: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const HeaderContent: Model<IHeaderContent> = mongoose.model<IHeaderContent>(
	"HeaderContent",
	HeaderContentSchema
);

export default HeaderContent;
