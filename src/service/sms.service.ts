import twilio from "twilio";
import environment from "../config/environment";
import logger from "./logger";

const accountSid = environment.TWILIO_ACCOUNT_SID;
const authToken = environment.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

async function sendSMS(body: string, to: string) {
  const toPhoneNo = to[0] === '+' ? to : `+${to}`;

  try {
    const result = await twilioClient.messages.create({
      body: body,
      from: environment.TWILIO_PHONE_NO,
      to: toPhoneNo,
    });
    logger.info("[sendSMS]: SMS sent successfully:", result.sid)
    return true;
  } catch (error) {
    console.error("[sendSMS]: Error sending SMS:", error);
    throw error;
  }
}

export default {twilioClient, sendSMS};