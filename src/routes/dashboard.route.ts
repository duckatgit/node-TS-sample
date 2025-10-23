import { Router } from 'express';
import dashboardController from '../controller/dashboardController';

const dashboardRouter = Router();


dashboardRouter.post('/driver', dashboardController.driverDashboard);

export default dashboardRouter;
