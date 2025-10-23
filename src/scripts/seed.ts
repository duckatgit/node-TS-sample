import mongoose from "mongoose";
import User from "../model/user.model";
import HeaderContent, {
	HeaderEnum,
} from "../model/ContentManagement/HeaderContent";
import ContactUsContent from "../model/ContentManagement/ContactUsContent";
import AboutUs from "../model/ContentManagement/AboutUsContent";
import HomePageContent from "../model/ContentManagement/homePageContent";

import environment from "../config/environment";
import SubscriptionPlan from "../model/subscriptionPlan";

const MONGODB_URI =
	environment.DB_SERVER_URL || "mongodb://localhost:27017/reya-admin";

const adminData = {
	name: "Admin",
	email: "admin@reya.com",
	password: "Admin@123",
	role: "ADMIN",
	isVerified: true,
};

const updateAdminData = {
	fullName: "Admin",
};

// ✅ Section content seed data
const sectionContents = [
	{
		section: HeaderEnum.HOME,
		heading: "We're here to support your journey",
		subHeading:
			"Every ride is a promise of safety and dignity. Our team stands ready to ensure your comfort and confidence from start to finish.",
		image: "", // optional: add image path or URL
	},
	{
		section: HeaderEnum.ABOUT,
		heading: "Experience the future of luxury rideshare with RÉYA.",
		subHeading:
			"Discover how RÉYA is transforming transportation for women. Our commitment to safety and luxury redefines rideshare.",
		image: "",
	},
	{
		section: HeaderEnum.INVESTORS,
		heading: "Invest in RÉYA — Be Part of the Movement",
		subHeading:
			"Break ground on a revolution. Women driving change, one luxury ride at a time.",
		image: "",
	},
	{
		section: HeaderEnum.CONTACT,
		heading: "We're here to support your journey",
		subHeading:
			"Every ride is a promise of safety and dignity. Our team stands ready to ensure your comfort and confidence from start to finish.",
		image: "",
	},
];

const contactData = {
	heading: "Send us a message",
	subHeading: "We listen. We care. We respond with precision.",
	email: "support@reyaapp.com",
	phone: "+91-XXXX-XXXXXX",
	addressLine1: "100 Southeast Third Avenue, Suite 1000",
	city: "Fort Lauderdale",
	state: "FL",
	postalCode: "33394",
	country: "USA",
	supportCards: [
		{
			type: "Email",
			title: "Email Support",
			description: "Direct line for all your general inquiries",
			actionLabel: "Contact",
			actionUrl: "mailto:support@reyaapp.com",
			icon: "/icons/email.png",
		},
		{
			type: "Phone",
			title: "Call Center",
			description: "Direct line for all your general inquiries",
			actionLabel: "Call",
			actionUrl: "tel:+91XXXXXXX",
			icon: "/icons/phone.png",
		},
		{
			type: "Chat",
			title: "Live support channels",
			description: "Direct line for all your general inquiries",
			actionLabel: "Start",
			actionUrl: "/chat",
			icon: "/icons/chat.png",
		},
	],
};

const aboutUsContent = {
	founder: {
		heading: "A Word from",
		title: "A Word from Our Founder",
		name: "Aman Cirius",
		designation: "Founder & CEO",
		image: "https://example.com/images/founder.jpg",
		description:
			"RÉYA was born from a vision: to create the safest, most luxurious, and most dignified rideshare experience for women. As a founder, a leader, and a believer in empowerment, I built RÉYA not just as a service, but as a movement. Every ride is a statement of freedom, trust, and community. With RÉYA, luxury is no longer a privilege — it is the standard women deserve.”",
	},

	promise: {
		heading: "REYA Promise",
		title:
			"Discover the RÉYA Experience: Where Safety Meets Luxury and Empowerment.",
		subtitle:
			"At RÉYA, we prioritize your safety without compromising on luxury. Our rides are designed to empower women, providing a dignified experience that fosters trust and community. Join us in redefining what transportation means for women everywhere.",
		items: [
			{
				icon: "https://example.com/icons/safety.png",
				title: "Safety First",
				description: "Every driver is verified, trained, and women-first.",
			},
			{
				icon: "https://example.com/icons/luxury.png",
				title: "Luxury Standard",
				description: "Every ride feels elegant, premium, and seamless.",
			},
			{
				icon: "https://example.com/icons/empowerment.png",
				title: "Empowerment",
				description:
					"RÉYA creates opportunities for women to lead, drive, and thrive.",
			},
		],
	},
	missionVision: {
		heading: "Mission & Vision",
		mission: {
			title: "Our Mission",
			description:
				"To empower women with safe, luxurious, and dignified transportation,  redefining mobility as a space of trust and empowerment",
			image: "https://example.com/images/mission.jpg",
		},
		vision: {
			title: "Our Vision",
			description:
				"To be the most trusted women-first luxury rideshare in the world, transforming  every ride into a symbol of confidence and freedom",
			image: "https://example.com/images/vision.jpg",
		},
	},
};

const homePageContent = {
	heading: "Why RÉYA”",
	description:
		"At RÉYA, we believe every woman deserves more than a ride — she deserves an experience that honors her dignity, her freedom, and her peace of mind. That’s why RÉYA was built differently from the ground up: by women, for women.",
	feature: [
		{
			image: "http://example.com/uploads/images/feature1.jpg",
			heading: "Safety first",
			title: "With RÉYA, safety isn’t an option — it’s the foundation.",
			points: ["Durable", "Long-lasting", "Affordable"],
			description:
				"Because every woman deserves to feel valued, dignified, and empowered in her journey",
		},
		{
			image: "http://example.com/uploads/images/feature2.jpg",
			heading: "Luxury Standard",
			title:
				"RÉYA is not just about getting from A to B — it’s about arriving in elegance",
			points: ["Cutting-edge", "Advanced technology", "User-friendly"],
			description:
				"Because every woman deserves to feel valued, dignified, and empowered in her journey",
		},
		{
			image: "http://example.com/uploads/images/feature2.jpg",
			heading: "Empowerment Always",
			title: "RÉYA is more than a company — it’s a platform for empowerment.",
			points: ["Cutting-edge", "Advanced technology", "User-friendly"],
			description:
				"Because every woman deserves to feel valued, dignified, and empowered in her journey",
		},
	],
	performance: [
		{
			title: "Performance Excellence",
			description: "Our products excel in every test.",
			image: "http://example.com/uploads/images/performance.jpg",
		},
	],
	closingLine:
		"RÉYA is not just a rideshare. It’s a sanctuary on wheels — redefining safety, luxury, and empowerment for women everywhere.",
	LuxuryExperience: {
		title: "Welcome to RÉYA — your luxury ride experience, redefined.",
		description:
			"Experience unparalleled safety and elegance with every ride. RÉYA empowers you to travel in style.",
		video: "http://example.com/uploads/videos/luxury_video.mp4",
	},
	safetyHighlight: {
		heading: "Because your safety matters.",
		subHeading: "Stay on the safe side with RÉYA",
		title: "We want everyone to have the same focus on safety.",
		description: "Our safety features exceed industry standards.",
		image: "http://example.com/uploads/images/safety_image.jpg",
	},
	explore: {
		heading: "Explore More",
		description: "Learn about our diverse range of products.",
	},
	userId: "68dd0fff71b0d65a5d6c98e6",
};

const plans = [
	{
		name: "RÉYA Essential",
		title: "Benefits / Logic",
		price: 19.99,
		period: "monthly",
		features: [
			"Fixed fares (no surge pricing for members)",
			"Priority matching with women drivers",
			"$5 late-night safety credit (auto-applied between 10 PM – 5 AM, 1x per month)",
			"Push updates + early access (notifications)",
		],
		discount: 0,
		freeRideCredits: 0,
		badge: "Elite",
		matadata: {
			productId: "prod_TFfgpirWvB6hC3",
			priceId: "price_1SJALKGzKQk7WiBaUImXcF64"
		}
	},
	{
		name: "RÉYA Luxe",
		title: "Includes Essential benefits +",
		price: 39.99,
		period: "monthly",
		features: [
			"Includes Essential benefits +",
			"5% discount applied to all rides",
			"1 free ride credit / month (max $15 value)",
			"In-car perks flag enabled (refreshments, charging, playlists)",
			"VIP customer support routing (priority in support system)",
			"Event/community access (in-app ticket links)",
		],
		discount: 5,
		freeRideCredits: 1,
		badge: "Elite",
		matadata: {
			productId: "prod_TFfhn7FkyBCeMt",
			priceId: "price_1SJAM7GzKQk7WiBaoRjM5qZx",
		}
	},
	{
		name: "RÉYA Elite",
		title: "Includes Luxe benefits +",
		price: 59.99,
		period: "monthly",
		features: [
			"Includes Luxe benefits +",
			"10% discount applied to all rides",
			"3 free ride credits / month (max $20 each)",
			"Free upgrade flag: auto-upgrade to premium vehicles when available",
			"Exclusive events access (special invites pushed via app)",
			"“Elite Member” badge displayed in app profile",
		],
		discount: 10,
		freeRideCredits: 3,
		badge: "Elite",
		matadata: {
			productId: "prod_TFfgpirWvB6hC3",
			priceId: "price_1SJALKGzKQk7WiBaUImXcF64",
		}
	},
];

async function seed() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("✅ MongoDB connected");

		// 🔹 Seed Admin
		const existingAdmin = await User.findOne({ email: adminData.email });
		if (!existingAdmin) {
			const newAdmin = new User(adminData);
			await newAdmin.save();
			console.log("✅ Admin user created");
		} else {
			await User.findOneAndUpdate({ email: adminData.email }, updateAdminData, {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			});
			console.log("ℹ️ Admin already exists");
		}

		await SubscriptionPlan.deleteMany({});
		await SubscriptionPlan.insertMany(plans);

		// 🔹 Seed Section Content
		for (const content of sectionContents) {
			await HeaderContent.findOneAndUpdate(
				{ section: content.section },
				content,
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			);
		}
		console.log("✅ Section content seeded");

		// Check if content already exists
		const existing = await ContactUsContent.findOne({});
		if (existing) {
			console.log("Contact content already exists. Updating...");
			await ContactUsContent.findByIdAndUpdate(existing._id, contactData, {
				new: true,
				runValidators: true,
			});
			console.log("Contact content updated successfully");
		} else {
			await ContactUsContent.create(contactData);
			console.log("Contact content seeded successfully");
		}

		const existingAboutUs = await AboutUs.findOne({});
		if (existingAboutUs) {
			console.log("About Us content already exists. Updating...");
			await AboutUs.findByIdAndUpdate(existingAboutUs._id, aboutUsContent, {
				new: true,
				runValidators: true,
			});
			console.log("About Us content updated successfully");
		} else {
			await AboutUs.create(aboutUsContent);
			console.log("About Us content seeded successfully");
		}

		const existingHomePage = await HomePageContent.findOne({});
		if (existingHomePage) {
			console.log("About Us content already exists. Updating...");
			await HomePageContent.findByIdAndUpdate(
				existingHomePage._id,
				homePageContent,
				{
					new: true,
					runValidators: true,
				}
			);
			console.log("Home Page content updated successfully");
		} else {
			await HomePageContent.create(homePageContent);
			console.log("Home Page content seeded successfully");
		}

		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding data:", error);
		process.exit(1);
	}
}

seed();
