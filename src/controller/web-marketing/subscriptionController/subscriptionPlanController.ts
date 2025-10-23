import { NextFunction, Request, Response } from "express";
import { failAction, successAction } from "../../../utils/response";
import SubscriptionPlan from "../../../model/subscriptionPlan";
import { validateFields } from "../../../utils/validateFields";
import LeadDriverRider from "../../../model/ContentManagement/LeadSchema";
import Subscription from "../../../model/subscription.model";
import stripService, { CustomerData, PaymentData, SubscriptionData } from "../../../service/stripe.service";
import { IStatus } from "../../../model/payment.model";
import { DbOperationObject } from "../../../common/interface";
import { constants } from "../../../common/constants";
import { paymentModel, subscriptionModel } from "../../../model";
import { performDbOperations } from "../../../db/db";
import utils from "../../../common/utils";
import subscriptionManager from "../../../manager/subscription.manager";

export const getAllSubscriptionPlan = async ( req: Request, res: Response, next: NextFunction) => {
	try {
		const getSubscriptionPlan = await SubscriptionPlan.find();

		if (!getSubscriptionPlan) {
			return res.status(404).json({
				status: false,
				message: "Subscription plan not found.",
			});
		}

		res.json(
			successAction(getSubscriptionPlan, "Subscription fetch successfully.")
		);
	} catch (err: any) {
		res.status(500).json({
			status: false,
			message: "Internal server error.",
			err: err.message,
		});
	}
};

export const createNewSubscription = async(req: Request, res: Response, next: NextFunction) => {
	try {
		const required = ["userId", "subscriptionId"];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const {userId, subscriptionId} = req.body

		const [user, subsctiptionPlan, subscription]: any = await Promise.all([
			LeadDriverRider.findById(userId),
			SubscriptionPlan.findById(subscriptionId),
			subscriptionModel.findOne({userId}),
		])

		if (!user) {
			return res.status(404).json({
				status: false,
				message: "User not found!",
			});
		}

		if (!subsctiptionPlan) {
			return res.status(404).json({
				status: false,
				message: "Subscription plan not found!",
			});
		}

		let customerId: any = "";

		if(!subscription || !subscription.stripCustomerId) {
			const data: CustomerData = {email: user.email, phone: user.phoneNumber, name: user.fullName};
			const customer: any = await stripService.createCustomer(data);
			customerId = customer.id;
		}else {
			customerId = subscription.stripCustomerId;
		}

		const amount = Math.round(subsctiptionPlan.price*100);

		const subscriptionData: SubscriptionData = {customerId, priceId: subsctiptionPlan.matadata.priceId}

		const subscriptionResult: any = await stripService.createSubscription(subscriptionData);

		if(!subscriptionResult) {
			res.json({status: false, message: 'Subscription creation failed!'});
		}

		const paymentObj: any = subscriptionResult.latest_invoice.confirmation_secret;
		
		const dbObjectList = subscriptionManager.createSubscriptionDBObject(
			subscriptionResult,
			userId,
			customerId,
			subsctiptionPlan._id,
			amount
		);

		await performDbOperations(dbObjectList);

		res.json(
			successAction({clientSecret: paymentObj.client_secret}, "success")
		);
	} catch (err: any) {
		res.status(500).json({
			status: false,
			message: "Internal server error.",
			err: err.message,
		});
	}
}

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const required = ["userId", "subscriptionId"];
		const validation = validateFields(req.body, required);

		if (!validation.valid) {
			res.status(400).json({
				status: false,
				message: "Missing fields",
				fields: validation.missingFields,
			});
			return;
		}

		const {userId, subscriptionId} = req.body

		const [user, subsctiptionPlan, subscription]: any = await Promise.all([
			LeadDriverRider.findById(userId),
			SubscriptionPlan.findById(subscriptionId),
			subscriptionModel.findOne({userId}),
		])

		if (!user) {
			return res.status(404).json({
				status: false,
				message: "User not found!",
			});
		}

		if (!subsctiptionPlan) {
			return res.status(404).json({
				status: false,
				message: "Subscription plan not found!",
			});
		}

		
	} catch (err: any) {
		res.status(500).json({
			status: false,
			message: "Internal server error.",
			err: err.message,
		});
	}
}


