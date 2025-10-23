import InvestorContact, {
	InvestementTier,
} from "../model/ContentManagement/InvestorContact";
import { appendToGoogleSheet } from "../utils/googleSheet";

// export const createInvestorService = async (data: {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// 	phone: string;
// 	countryResidence: string;
// 	amount: number;
// 	investmentTier: InvestementTier;
// 	message?: string;
// 	agree: boolean;
// }) => {
// 	const investor = await InvestorContact.create(data);
// 	const excelData = {
// 			sheetName: "Investor" as "Investor",
// 			formData: {
// 				firstName: investor.firstName,
// 				lastName: investor.lastName,
// 				email: investor.email,
// 				phone: investor.phone,
// 				countryResidence: investor.countryResidence,
// 				amount: investor.amount,
// 				investmentTier:investor.investmentTier,
// 				message: investor.message,
// 			},
// 		};
// 		await appendToGoogleSheet(excelData);
// 	return investor;
// };

export const getInvestorListService = async (
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
		const total = await InvestorContact.countDocuments(query);
		const posts = await InvestorContact.find(query)
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
