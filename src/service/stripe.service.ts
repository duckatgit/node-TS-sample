import Stripe from "stripe";
import environment from "../config/environment";
import logger from "./logger";

const stripe = new Stripe(environment.STRIPE_SECRET_KEY as string,);

export interface CustomerData {
    email?: string;
    phone?: string;
    name?: string;
}

export interface PaymentData {
    amount: number; // in cents
    currency?: string;
    customerId?: string;
}

export interface SubscriptionData {
    customerId: string;
    priceId: string; // Stripe Price ID
}

export interface RefundData {
    paymentIntentId: string;
    amount?: number; // optional partial refund
}

// --------------------- Create Customer ---------------------
const createCustomer = async (data: CustomerData) => {
    try {
        const customer = await stripe.customers.create({
            phone: data.phone,
            email: data.email,
            name: data.name,
        });
        return customer;
    } catch (err) {
        logger.info(`Stripe createCustomer error: ${(err as Error).message}`)
        throw new Error(`Stripe createCustomer error: ${(err as Error).message}`);
    }
};

// --------------------- One-time Payment ---------------------
const createPaymentIntent = async (data: PaymentData) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: data.currency || "usd",
            customer: data.customerId,
            payment_method_types: ["card"],
        });
        return paymentIntent;
    } catch (err) {
        logger.info(`Stripe createPaymentIntent error: ${(err as Error).message}`)
        throw new Error(`Stripe createPaymentIntent error: ${(err as Error).message}`);
    }
};

// --------------------- Create Subscription ---------------------
const createSubscription = async (data: SubscriptionData) => {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: data.customerId,
            items: [{ price: data.priceId }],
            payment_behavior: "default_incomplete",
            expand: ["latest_invoice.confirmation_secret"],
        });
        return subscription;
    } catch (err) {
        logger.info(`Stripe createSubscription error: ${(err as Error).message}`)
        throw new Error(`Stripe createSubscription error: ${(err as Error).message}`);
    }
};

// --------------------- Apply Refund ---------------------
const createRefund = async (data: RefundData) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: data.paymentIntentId,
            amount: data.amount,
        });
        return refund;
    } catch (err) {
        logger.info(`Stripe createRefund error: ${(err as Error).message}`)
        throw new Error(`Stripe createRefund error: ${(err as Error).message}`);
    }
};

// --------------------- Get Payment Intent ---------------------
const getPaymentIntent = async (id: string, option: any = {}) => {
  return await stripe.paymentIntents.retrieve(id, option);
};

// --------------------- Get Subsctiption ---------------------
const getSubscription = async (id: string) => {
  return await stripe.subscriptions.retrieve(id);
};

// --------------------- Update Subsctiption ---------------------
const updateSubscription = async (subscriptionId: string, items: any[]) => {
  return await stripe.subscriptions.update(subscriptionId, {
    items,
  });
};

// --------------------- Cancel Subsctiption ---------------------
const cancelSubscription = async (subscriptionId: string, atPeriodEnd = true) => {
  return await stripe.subscriptions.cancel(subscriptionId, {
    invoice_now: !atPeriodEnd,
  });
};

export default {
    stripe,
    createCustomer,
    createPaymentIntent,
    createSubscription,
    createRefund,
    getPaymentIntent,
    getSubscription,
    updateSubscription,
    cancelSubscription,
}