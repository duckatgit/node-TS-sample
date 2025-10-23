import { Router } from "express";
import {  getInvestorList } from "../../controller/web-marketing/investorController/investorController";

const investorRouter = Router();

// investorRouter.post("/create-investor", createInvestorContact);
investorRouter.get('/get-investor-list', getInvestorList )

export default investorRouter;
