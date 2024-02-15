import { Router } from "express";
import UserRouter from "./user";

const router = Router();

router.use('/user', UserRouter);

export default router;