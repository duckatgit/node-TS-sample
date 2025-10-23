import mongoose, { Schema, Document } from "mongoose";

export interface ISupportCard {
  type: "Email" | "Phone" | "Chat";
  title: string;
  description: string;
  actionLabel: string;
  icon?: string;
}

export interface IContact extends Document {
  heading: string;
  subHeading: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  supportCards: ISupportCard[];
  createdAt?: Date;
  updatedAt?: Date;
}

const supportCardSchema = new Schema<ISupportCard>(
  {
    type: { type: String, enum: ["Email", "Phone", "Chat"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    actionLabel: { type: String, required: true, trim: true },
    icon: { type: String, default: null },
  },
  { _id: false }
);

const contactSchema = new Schema<IContact>(
  {
    heading: { type: String, required: true, trim: true },
    subHeading: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    supportCards: { type: [supportCardSchema], default: [] },
  },
  { timestamps: true }
);

const ContactUsContent = mongoose.model<IContact>("ContactUsContent", contactSchema);

export default ContactUsContent;
