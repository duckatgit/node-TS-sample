import ContactUs, { InquiryType } from "../model/ContentManagement/ContactUs";
import { appendToGoogleSheet } from "../utils/googleSheet";

export const createContactUsService = async (data: {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	inquiry: InquiryType;
	message: string;
	agree: boolean;
}) => {
	const contactUs = await ContactUs.create(data);
	const excelData = {
		sheetName: "Contact Us" as "Contact Us",
		formData: {
			firstName: contactUs.firstName,
			lastName: contactUs.lastName,
			email: contactUs.email,
			phone: contactUs.phone,
			inquiry: contactUs.inquiry,
			message: contactUs.message,
			agree: contactUs.agree ? "Yes" : "No",
		},
	};
	await appendToGoogleSheet(excelData);
	return contactUs;
};

export const getContactUsListService = async (
	search: string,
	page: number = 1,
	limit: number = 10,
	sortBy: any,
	sortOrder: number
) => {
	try {
		const skip = (page - 1) * limit;
		let query: any;

		query = search
			? {
					$or: [
						{ firstName: { $regex: search, $options: "i" } },
						{ lastName: { $regex: search, $options: "i" } },
						{ email: { $regex: search, $options: "i" } },
					],
			  }
			: {};

		query.isDeleted = false;
		const safeSortBy =
			typeof sortBy === "string" && sortBy.trim() !== "" ? sortBy : "createdAt";
		const safeSortOrder = sortOrder === 1 || sortOrder === -1 ? sortOrder : -1;
		const total = await ContactUs.countDocuments(query);
		const posts = await ContactUs.find(query)
			.sort({ [safeSortBy]: safeSortOrder })
			.skip(skip)
			.limit(limit)
			.lean();

		const data = {
			data: posts,
			pagination: {
				total: total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};

		return data;
	} catch (err) {
		throw new Error("something went wrong");
	}
};
