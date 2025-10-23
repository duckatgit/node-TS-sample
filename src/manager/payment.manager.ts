import { Response } from "express"
import { paymentModel, subscriptionModel, userModel } from "../model";
import utils from "../common/utils";
import { responseCode, responseMsg } from "../common/response";
import { IStatus } from "../model/payment.model";
import { DbOperationObject } from "../common/interface";
import { constants, stripeWebhookEvents } from "../common/constants";
import { performDbOperations, performSingleDBOperation } from "../db/db";
import LeadDriverRider from "../model/ContentManagement/LeadSchema";
import userHelper from "../helper/user.helper";

const handlePaymentIntent = async (paymentIntentId: string, eventType: string, res: Response) => {

    const payment: any = await paymentModel.findOne({ stripePaymentIntentId: paymentIntentId }).lean();

    if (!payment) {
        return utils.sendFailedResponse(res, responseCode.NOT_FOUND, "payment not found");
    }

    payment.status = eventType === stripeWebhookEvents.PAYMENT_SUCCESS ? IStatus.PAID : IStatus.FAILED;

    const paymentDBObject: DbOperationObject = {
        type: constants.UPDATE,
        model: paymentModel,
        query: { _id: payment._id },
        update: { $set: payment }
    }

    performSingleDBOperation(paymentDBObject);

    return utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.SUCCESS);

}

const handleInvoicePayment = async (subscriptionId: string, paymentIntent: string, eventType: string, res: Response) => {

    const subsctiption: any = await subscriptionModel.findOne({ stripeSubscriptionId: subscriptionId }).lean();

    if (!subsctiption) {
        return utils.sendFailedResponse(res, responseCode.NOT_FOUND, "subsctiption not found");
    }

    subsctiption.status = eventType === stripeWebhookEvents.INVOICE_PAYMENT_SUCCESS ? IStatus.PAID : IStatus.FAILED;

    const dbObjList: any = [];
    let newUser: any;

    if (eventType === stripeWebhookEvents.INVOICE_PAYMENT_SUCCESS) {
        const existingUser = await userModel.findOne({ _id: subsctiption.userId })

        if (!existingUser) {

            const leadUser: any = await LeadDriverRider.findById(subsctiption.userId).lean();

            newUser = await userHelper.saveUserFromLeadTable(leadUser);

        }
    }

    if(newUser) {
        subsctiption.userId = newUser._id;

        dbObjList.push({
            type: constants.UPDATE,
            model: paymentModel,
            query: { _id: subsctiption._id },
            update: { $set: subsctiption }
        })


    }

    dbObjList.push({
        type: constants.UPDATE,
        model: subscriptionModel,
        query: { _id: subsctiption._id },
        update: { $set: subsctiption }
    })

    performDbOperations(dbObjList);

    return utils.sendSuccessResponse(res, responseCode.SUCCESS, responseMsg.SUCCESS);
}

export default {
    handlePaymentIntent,
    handleInvoicePayment
}