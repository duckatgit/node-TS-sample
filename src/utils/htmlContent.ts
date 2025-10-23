import { DriverType } from "../model/ContentManagement/LeadSchema";
import RiderSubscriptionDetails from "./subscriptionDetails";

export const sendSignupEMailForUser = (
	fullName: string,
	email: string,
	password: string,
	url: string
) => {
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Account Created Successfully</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
               <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                 Hi, <strong>${fullName}</strong>
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                  Welcome to <strong>RÉYA</strong> Luxury Rides.
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                  Here are the temporary user credentials:
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Full Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Password:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
                  </tr>
                </table>

                 <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">To verify your account, please click the button below:</p>
                 <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px; margin-bottom: 16px;">Verify Email</a>
                  </div>

                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Please change your password upon first login for security reasons.
                </p>

                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Best regards,<br />
                   <strong>The RÉYA Team</strong><br />
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const DriverWelcomeMail = (firstName: string) => {
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 22px; color: #2d3748; letter-spacing: 0.5px;">Welcome to the RÉYA Driver Waitlist</h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">
                  Dear <strong>${firstName}</strong>,
                </p>
                <p style="margin: 0 0 16px; font-size: 16px;">
                  Thank you for applying to join the <strong>RÉYA Driver Waitlist</strong>. You are now officially on the path to becoming part of a movement that is redefining rideshare with <strong>Safety, Luxury, and Empowerment</strong> at its core.
                </p>

                <p style="margin: 0 0 8px; font-size: 16px;">As one of our first drivers, you will enjoy:</p>

                <ul style="margin: 8px 0 24px 20px; padding: 0; font-size: 16px;">
                  <li><strong>High Earning Potential</strong> – generous revenue split and Founders Club benefits.</li>
                  <li><strong>Premium Standard</strong> – driving only luxury EVs, hybrids, and first-class vehicles.</li>
                  <li><strong>Empowerment Always</strong> – being part of a women-first network built on trust.</li>
                </ul>

                <p style="margin: 0 0 16px; font-size: 16px;">
                  Our team will contact you as soon as applications open in your city. In the meantime, stay connected with us on
                  <a href="https://www.instagram.com/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">Instagram</a>
                  and
                  <a href="https://www.linkedin.com/in/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">LinkedIn</a>
                  for updates.
                </p>

                <p style="margin: 24px 0; font-size: 16px;">
                  Together, we are building something extraordinary.
                </p>

                <p style="margin: 16px 0 0; font-size: 16px;">
                  With appreciation,<br />
                  <strong>The RÉYA Team</strong><br />
                  <a href="mailto:support@reyaapp.com" style="color: #6B2D4C; text-decoration: none;">support@reyaapp.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const RiderWelcomeMail = (
	firstName: string,
	planType: keyof typeof RiderSubscriptionDetails
) => {
	const planDetail =
		RiderSubscriptionDetails[planType] || RiderSubscriptionDetails.Essential;
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 22px; color: #2d3748; letter-spacing: 0.5px;">Welcome to the RÉYA Rider Waitlist</h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">
                  Dear <strong>${firstName}</strong>,
                </p>
                <p style="margin: 0 0 16px; font-size: 16px;">
                  Thank you for applying to join the <strong>RÉYA Rider Waitlist</strong>. You are now officially on the path to becoming part of a movement that is redefining rideshare with <strong>Safety, Luxury, and Empowerment</strong> at its core.
                </p>

                <p style="margin: 0 0 8px; font-size: 16px;">As one of our first Riders, you will enjoy:</p>

                 <ul style="margin: 8px 0 24px 20px; padding: 0; font-size: 16px;">
                  <li>${planDetail}</li>
                </ul>

                <p style="margin: 0 0 16px; font-size: 16px;">
                  Our team will contact you as soon as applications open in your city. In the meantime, stay connected with us on
                  <a href="https://www.instagram.com/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">Instagram</a>
                  and
                  <a href="https://www.linkedin.com/in/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">LinkedIn</a>
                  for updates.
                </p>

                <p style="margin: 24px 0; font-size: 16px;">
                  Together, we are building something extraordinary.
                </p>

                <p style="margin: 16px 0 0; font-size: 16px;">
                  With appreciation,<br />
                  <strong>The RÉYA Team</strong><br />
                  <a href="mailto:support@reyaapp.com" style="color: #6B2D4C; text-decoration: none;">support@reyaapp.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const InvestorWelcomeMail = (firstName: string) => {
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 22px; color: #2d3748; letter-spacing: 0.5px;">Welcome to the RÉYA Investor Waitlist</h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0 0 16px; font-size: 16px;">
                  Dear <strong>${firstName}</strong>,
                </p>
                <p style="margin: 0 0 16px; font-size: 16px;">
                 Thank you for your interest. Our Investor Relations team will contact you within 24–48 hours.
                </p>

                

                <p style="margin: 0 0 16px; font-size: 16px;">
                  Our team will contact you as soon as applications open. In the meantime, stay connected with us on
                  <a href="https://www.instagram.com/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">Instagram</a>
                  and
                  <a href="https://www.linkedin.com/in/ridereya" target="_blank" style="color: #6B2D4C; text-decoration: none;">LinkedIn</a>
                  for updates.
                </p>

                <p style="margin: 24px 0; font-size: 16px;">
                  Together, we are building something extraordinary.
                </p>

                <p style="margin: 16px 0 0; font-size: 16px;">
                  With appreciation,<br />
                  <strong>The RÉYA Team</strong><br />
                  <a href="mailto:support@reyaapp.com" style="color: #6B2D4C; text-decoration: none;">support@reyaapp.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const AdminInvestorEmail = (
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	amount: number,
	countryResidence: string,
	investmentTier: string,
	message: string
) => {
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Investor Form Submitted Successfully</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
               <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                 Hi, <strong>Admin</strong>
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                  Investor successfull submitted the form here is the Investor Details:
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">First Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${firstName}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Last Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Phone Number:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${phoneNumber}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Country of residence:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${countryResidence}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Amount:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${amount}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Investment Tier:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${investmentTier}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Message:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
                  </tr>
                </table>

                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Best regards,<br />
                   <strong>The RÉYA Team</strong><br />
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const AdminDriverEmail = (data: {
	fullName: string;
	phoneNumber: string;
	email: string;
	language: string;
	city: string;
	drivingLicenseNumber: string;
	driverType: DriverType;
	insurance: string;
	vehicleRegistration: string;
	drivingLicenseImage: string;
	trainingCertificate: string;
	founderClub: boolean;
	daycareProgram: boolean;
	guardianCertification: boolean;
}) => {
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Driver Form Submitted Successfully</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
               <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                 Hi, <strong>Admin</strong>
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                  Driver successfull submitted the form here is the Driver Details:
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Full Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.fullName
										}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.email
										}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Password:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.phoneNumber
										}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Language:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.language
										}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">City:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.city
										}</td>
                  </tr>

                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Driving License Number:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.drivingLicenseNumber
										}</td>
                  </tr>

                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Driver Type:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.driverType
										}</td>
                  </tr>
                    <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Insurance:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.insurance
										}</td>
                  </tr>

                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Vehicle Registration:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.vehicleRegistration
										}</td>
                  </tr>

                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Driving License:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.drivingLicenseImage
										}</td>
                  </tr>

                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Training Certificate:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.trainingCertificate
										}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Founder Club:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.founderClub ? "Yes" : "No"
										}</td>
                  </tr>

                    <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Daycare Program:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.daycareProgram ? "Yes" : "No"
										}</td>
                  </tr>

                    <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Guardian Certification:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${
											data.guardianCertification ? "Yes" : "No"
										}</td>
                  </tr>
                </table>

                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Best regards,<br />
                   <strong>The RÉYA Team</strong><br />
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const AdminRiderEmail = (
	fullName: string,
	email: string,
	phoneNumber: string,
	language: string,
	planType: keyof typeof RiderSubscriptionDetails
) => {
	const planDetail =
		RiderSubscriptionDetails[planType] || RiderSubscriptionDetails.Essential;
	const htmlContent = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Rider Form Submitted Successfully</h1>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 32px;">
               <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                 Hi, <strong>Admin</strong>
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">
                  Rider successfull submitted the form here is the Rider Details:
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Full Name:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Phone Number:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${phoneNumber}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Language:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${language}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Subscription Plan:</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${planDetail}</td>
                  </tr>
                </table>

                <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Best regards,<br />
                   <strong>The RÉYA Team</strong><br />
                </p>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
	return htmlContent;
};

export const forgotPasswordVerifyUrlContent = (url: string) => {
	const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Reset Your Password</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">Hello,</p>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your RÉYA Technologies Inc account. Click the button below to proceed:</p>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px; margin-bottom: 16px;">Reset Password</a>
                  </div>
                  
                  <!-- URL Box with Copy Instructions -->
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:</p>
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; font-family: monospace; font-size: 14px; color: #334155; word-break: break-all;">
                      ${url}
                    </div>
                    <p style="margin: 12px 0 0; font-size: 13px; color: #64748b;">
                      <strong>To copy:</strong> Select the text above, then press Ctrl+C (Windows) or ⌘+C (Mac)
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">If you didn't request this, you can safely ignore this email.</p>
                  <p style="margin: 0; font-size: 14px; color: #718096;">This link will expire in 1 hour for security reasons.</p>

                   <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.5;">
                  Best regards,<br />
                   <strong>The RÉYA Team</strong><br />
                </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
	return htmlContent;
};


export const emailVerifyUrlContent = (url: string) => {
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f9fc; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="90%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                  <h1 style="margin: 0; font-size: 24px; color: #2d3748;">Verify Your Email</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">Hello</p>
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">To verify your account, please click the button below:</p>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px; margin-bottom: 16px;">Verify Email</a>
                  </div>
                  
                  <!-- URL Box with Copy Instructions -->
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #64748b;">Or copy and paste this link into your browser:</p>
                    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px; font-family: monospace; font-size: 14px; color: #334155; word-break: break-all;">
                      ${url}
                    </div>
                    <p style="margin: 12px 0 0; font-size: 13px; color: #64748b;">
                      <strong>To copy:</strong> Select the text above, then press Ctrl+C (Windows) or ⌘+C (Mac)
                    </p>
                  </div>
                  
                  <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">If you didn't request this, you can safely ignore this email.</p>
                  <p style="margin: 0; font-size: 14px; color: #718096;">This link will expire in 1 hour for security reasons.</p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
              <td style="padding: 20px 32px; background-color: #f9fafb; text-align: center; font-size: 14px; color: #718096;">
                <p style="margin: 0; font-weight: 600;">RÉYA Technologies Inc.</p>
                <p style="margin: 4px 0;">100 Southeast Third Avenue, Suite 1000<br/>Fort Lauderdale, FL 33394</p>
                <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} RÉYA Technologies Inc. All rights reserved.</p>
              </td>
            </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
  return htmlContent;
};