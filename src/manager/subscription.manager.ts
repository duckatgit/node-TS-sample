import { constants } from "../common/constants";
import { DbOperationObject } from "../common/interface";
import utils from "../common/utils";
import { paymentModel, subscriptionModel } from "../model";
import { IStatus } from "../model/payment.model";

const createSubscriptionDBObject = (
    stripeSubscriptionObj: any,
    userId: string,
    customerId: string,
    subscriptionPlanID: string,
    amount: number

) => {
    const [subscriptionItem] = stripeSubscriptionObj.items.data;

    const paymentObj: any = stripeSubscriptionObj.latest_invoice.confirmation_secret;

    const match = paymentObj.client_secret.match(/(pi_[^_]+)_secret/);

    const paymentId = match ? match[1] : null;

    const dbObjectList: DbOperationObject[] = [];

    dbObjectList.push({
        type: constants.INSERT,
        model: subscriptionModel,
        doc: {
            userId: userId,
            stripCustomerId: customerId,
            subscriptionPlanId: subscriptionPlanID,
            stripeSubscriptionId: stripeSubscriptionObj.id,
            currentPeriodStart: utils.toMongoDate(subscriptionItem.current_period_start),
            currentPeriodEnd: utils.toMongoDate(subscriptionItem.current_period_end),
        }
    });

    dbObjectList.push({
        type: constants.INSERT,
        model: paymentModel,
        doc: {
            userId: userId,
            stripePaymentIntentId: paymentId,
            amount: amount,
            currency: stripeSubscriptionObj.latest_invoice.currency,
            status: IStatus.INITIATE,
        }
    });

    return dbObjectList;
}


export default {
    createSubscriptionDBObject,

}