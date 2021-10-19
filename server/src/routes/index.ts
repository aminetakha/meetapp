import { Router } from "express";
import authRoute from "./auth"
import userRoute from "./user"
import chatRoute from "./chat"
import paymentRoute from "./payment"
import configRoute from "./config"

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/chat", chatRoute);
router.use("/pay", paymentRoute);
router.use("/config", configRoute);

export default router;
