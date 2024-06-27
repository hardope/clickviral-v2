import { Router } from "express";
import userRouter from "../apps/user/route";

const router = Router();

router.use('/user', userRouter);

export default router;