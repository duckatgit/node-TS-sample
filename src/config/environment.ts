import dotenv from 'dotenv';
dotenv.config();

const environment = {
    DB_SERVER_URL: process.env.DB_SERVER_URL,
    PORT: process.env.PORT, 
    HOST: process.env.HOST, 
    SENDER_MAIL: process.env.SENDER_MAIL,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    JWC_EXPIRE_TIME: process.env.JWC_EXPIRE_TIME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NO: process.env.TWILIO_PHONE_NO,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SK_KEY,
    STRIPE_WEBHOOK_KEY: process.env.STRIPE_WEBHOOK_KEY,
};

export default environment;
