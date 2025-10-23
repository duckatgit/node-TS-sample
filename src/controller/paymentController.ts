import { Request, Response } from "express";
import logger from "../service/logger";
import utils from "../common/utils";
import { responseCode, responseMsg } from "../common/response";
import stripService from "../service/stripe.service";
import environment from "../config/environment";
import paymentManager from "../manager/payment.manager";
import { stripeWebhookEvents } from "../common/constants";

const paymentStatus = async (req: Request, res: Response) => {
    try {

        const sig: any = req.headers["stripe-signature"];
        const endpointSecret: string = environment.STRIPE_WEBHOOK_KEY || "";
        let event;

        try {
            const strip = stripService.stripe;
            event = strip.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err: any) {
            logger.info("[Webhook Signature Failed]: ", err);
            utils.sendFailedResponse(res, responseCode.BAD_REQUEST, `Webhook Error: ${err.message}`);
            return
        }

        logger.info(`request received from ${req.originalUrl}, METHOD: ${req.method}: ${JSON.stringify(event)}`);

        // Handle different event types
        switch (event.type) {
            case stripeWebhookEvents.PAYMENT_SUCCESS: {
                const paymentIntent: any = event.data.object;
                console.log("✅ Payment succeeded:", paymentIntent.id);
                await paymentManager.handlePaymentIntent(paymentIntent.id, event.type,res);
                break;
            }

            case stripeWebhookEvents.PAYMENT_FAILED: {
                const paymentIntent: any = event.data.object;
                console.log("❌ Payment failed:", paymentIntent.id);
                await paymentManager.handlePaymentIntent(paymentIntent.id, event.type,res);
                break;
            }

            case stripeWebhookEvents.INVOICE_PAYMENT_SUCCESS: {
                const invoice: any = event.data.object;
                const subscriptionId: string = invoice.lines.data[0].subscription;
                console.log("💰 Subscription invoice paid:", invoice.id);
                await paymentManager.handleInvoicePayment(subscriptionId, event.type, res);
                break;
            }

            case stripeWebhookEvents.INVOICE_PAYMENT_FAILED: {
                const invoice: any = event.data.object;
                const subscriptionId: string = invoice.lines.data[0].subscription;
                console.log("🚫 Subscription payment failed:", invoice.id);
                await paymentManager.handleInvoicePayment(subscriptionId, event.type, res);
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

    } catch (error) {
        logger.info(error);
        utils.sendFailedResponse(res, responseCode.INTERNAL_SERVER_ERROR, responseMsg.INTERNAL_SERVER_ERROR);
    }
}

export default {
    paymentStatus
}