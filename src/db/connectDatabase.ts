import mongoose from "mongoose";
import logger from "../service/logger";
import environment from "../config/environment";


mongoose.set("strictQuery", true);

async function connectDatabase(): Promise<void> {
  try {
    const dbUrl = environment.DB_SERVER_URL;

    if (!dbUrl) {
      throw new Error("❌ Missing DB_SERVER_URL in environment variables");
    }

    await mongoose.connect(dbUrl);
    logger.info("✅ Connected to database");
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`❌ Database connection error: ${error.message}`);
    } else {
      logger.error("❌ Unknown database connection error");
    }
    logger.error("Could not connect to Database");
  }
}

export default connectDatabase;
