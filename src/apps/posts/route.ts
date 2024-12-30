import { Router } from 'express';
import postController from './controllers';
import { authorization, validateSchema } from '../../middleware';
import { postValidator } from './validators';

const postRouter = Router();

postRouter.post('/create', authorization(), validateSchema(postValidator.create), postController.createPost());
postRouter.get('/', authorization(), postController.getPosts());
postRouter.post('/like/:id', authorization(), postController.likePost());
postRouter.post('/unlike/:id', authorization(), postController.unlikePost());
postRouter.get('/comments/:id', authorization(), postController.getComments());

export default postRouter;