import { Router } from "express";
import headerContentRouter from "./headerContentRoutes";
import contactContentRouter from "./contactUsRoutes";
import aboutContentRouter from "./aboutUsRoutes";
import homeContentRouter from "./homePageRoutes";
import investorRouter from "./investorRoutes";
import userWebRoutes from "./userWebRoutes";
import riderSubscriptionRouter from "./subscription";
const websiteRouter = Router();

websiteRouter.use("/content", headerContentRouter);
websiteRouter.use("/contact", contactContentRouter);
websiteRouter.use("/content", aboutContentRouter);
websiteRouter.use("/content", homeContentRouter);
websiteRouter.use("/investor", investorRouter);
websiteRouter.use("/user", userWebRoutes);
websiteRouter.use("/subscription", riderSubscriptionRouter);

export default websiteRouter;
