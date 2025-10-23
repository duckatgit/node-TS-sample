import environment from '../config/environment';
import logger from './logger';
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(environment.SENDGRID_API_KEY as string);

const sendMail = async (receiver: string,subject: string,body: string, isHtml?: boolean): Promise<boolean> => {
  if (!receiver || !subject || !body) {
    logger.info('❌ sendMail: Missing required parameters.');
    return false;
  }

  try {
    const mailOptions = {
      from: `"Riya Ride" <${environment.SENDER_MAIL}>`,
      to: receiver.trim(),
      subject: subject.trim(),
      ...(isHtml ? { html: body } : {text: body}),
    };

    await sgMail.send(mailOptions);
    
    logger.info(`Email sent successfully to ${receiver}`);
    return true;
  } catch (error: any) {
    logger.error(`[sendMail]: Failed to send email to ${receiver}:`, error);
    throw error;
  }
};

export default {sendMail};
