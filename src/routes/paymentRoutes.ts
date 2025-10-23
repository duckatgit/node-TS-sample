import { Router } from 'express';
import paymentController from '../controller/paymentController';
import bodyParser from "body-parser";


const paymentRouter = Router();


paymentRouter.post(
    '/status',
    bodyParser.raw({ type: "application/json" }), 
    paymentController.paymentStatus
);


export default paymentRouter;
