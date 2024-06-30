import { Router } from "express";
import userRouter from "../apps/user/route";
import postRouter from "../apps/posts/route";

const router = Router();

router.use('/user', userRouter);
router.use('/posts', postRouter);

export default router;