export function generateStrongPassword(length: number = 8): string {
	const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lower = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";
	const symbols = "@$!%*?#&";
	const allChars = upper + lower + numbers + symbols;

	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

	let password = "";

	do {
		password = "";
		password += upper[Math.floor(Math.random() * upper.length)];
		password += lower[Math.floor(Math.random() * lower.length)];
		password += numbers[Math.floor(Math.random() * numbers.length)];
		password += symbols[Math.floor(Math.random() * symbols.length)];
		for (let i = 4; i < length; i++) {
			password += allChars[Math.floor(Math.random() * allChars.length)];
		}

		password = password
			.split("")
			.sort(() => Math.random() - 0.5)
			.join("");

	} while (!regex.test(password));

	return password;
}
