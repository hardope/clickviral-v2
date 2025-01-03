import { Request, Response } from 'express';
import { Posts } from '../models';

const getComments = () => {
    return async (req: Request, res: Response) => {
        const comments = await Posts.find({ type: 'comment', parent_post_id: req.params.id }).populate('user');
        const post = await Posts.findById(req.params.id).populate('user');
        const formattedComments = await Promise.all(await comments.map(async comment => await comment.toJSON(req.user)));

        res.status(200).send({
            post: await post?.toJSON(req.user),
            comments: formattedComments,
            message: 'Comments retrieved successfully',
            status: 'success'
        });

    }
}

export { getComments };