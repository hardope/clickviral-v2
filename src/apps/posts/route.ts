import { Router } from 'express';
import { index } from './controller';

const postRouter = Router();

postRouter.get('/', index());

export default postRouter;