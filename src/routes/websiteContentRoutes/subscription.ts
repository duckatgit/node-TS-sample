import { Router } from "express";
import { createNewSubscription, getAllSubscriptionPlan } from "../../controller/web-marketing/subscriptionController/subscriptionPlanController";

const riderSubscriptionRouter = Router();
riderSubscriptionRouter.get("/get-all-subscription", getAllSubscriptionPlan);
riderSubscriptionRouter.post("/createNewSubscription", createNewSubscription);

export default riderSubscriptionRouter;
