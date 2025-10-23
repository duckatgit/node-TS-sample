import { Router } from "express";
import authRouter from "./authRoutes";
import dashboardRouter from "./dashboard.route";
import userRouter from "./user.route";
import headingRouter from "./websiteContentRoutes";

const router = Router();

router.get("/test", (req, res) => {
  res.send("Test route working");
});

router.use(authRouter);
router.use(headingRouter);
router.use('/user', userRouter)
router.use('/dashboard', dashboardRouter)

export default router;
