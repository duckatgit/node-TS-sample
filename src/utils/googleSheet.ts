// import { google } from "googleapis";
// import { readFileSync } from "fs";
// import path from "path";
// import dotenv from "dotenv";
// import { IContactForm } from "../model/ContentManagement/ContactUs";
// dotenv.config();

// const spreadsheetId = process.env.SPREADSHEET_ID!;

// const CREDENTIALS_PATH = path.join(
// 	__dirname,
// 	"../service/excelservice-account.json"
// );
// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// const auth = new google.auth.GoogleAuth({
// 	credentials: JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8")),
// 	scopes: SCOPES,
// });

// export const appendContactToSheet = async (contact: IContactForm) => {
// 	const sheets = google.sheets({ version: "v4", auth });

// 	const row = [
// 		contact.firstName,
// 		contact.lastName,
// 		contact.email,
// 		contact.phone,
// 		contact.inquiry,
// 		contact.message || "",
// 		contact.agree ? "Yes" : "No",
// 		new Date().toISOString(),
// 	];

// 	await sheets.spreadsheets.values.append({
// 		spreadsheetId,
// 		range: "Sheet1!A1",
// 		valueInputOption: "USER_ENTERED",
// 		requestBody: { values: [row] },
// 	});
// };

import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const spreadsheetId = process.env.SPREADSHEET_ID!;
const CREDENTIALS_PATH = path.join(__dirname, "../service/excelservice-account.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8")),
  scopes: SCOPES,
});

interface AppendSheetOptions<T> {
  sheetName: "Driver" | "Rider" | "Contact Us" | "Investor";
  formData: T;
}

export const appendToGoogleSheet = async <T extends Record<string, any>>({
  sheetName,
  formData,
}: AppendSheetOptions<T>) => {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const headers = Object.keys(formData);
    const values = Object.values(formData);

    values.push(new Date().toISOString());

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });

    console.log(`✅ Data added to "${sheetName}" tab successfully!`);
    return { success: true };
  } catch (error: any) {
    console.error(`❌ Failed to append data to ${sheetName}:`, error.message);
    return { success: false, error: error.message };
  }
};

