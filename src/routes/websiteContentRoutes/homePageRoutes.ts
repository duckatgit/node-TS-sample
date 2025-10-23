import { Router } from "express";
import { verifyToken } from "../../middleware/verifyJWT";
import { getHomePageContent } from "../../controller/web-marketing/homePageController/homePageContent";

const homeContentRouter = Router();

homeContentRouter.get("/get-home-content", getHomePageContent);

export default homeContentRouter;
