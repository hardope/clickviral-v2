import { Request, Response } from "express";
import { PostLikes } from "../models";

const likePost = () => {
    return async (req: Request, res: Response) => {
        try {

            const currentLike = await PostLikes.findOne({ post_id: req.params.id, user_id: req.user });
            if (currentLike) {
                throw new Error("Post already liked");
            }
            await PostLikes.create({ post_id: req.params.id, user_id: req.user });
            res.status(200).send({
                "message": "Post liked successfully",
                "status": "success"
            });

        } catch (error: any) {

            res.status(500).send({
                "message": error.message,
                "status": "error"
            });
        }
    }
}

const unlikePost = () => {
    return async (req: Request, res: Response) => {
        try {

            const currentLike = await PostLikes.findOne({ post_id: req.params.id, user_id: req.user });
            if (!currentLike) {
                throw new Error("Post not liked");
            }
            await PostLikes.deleteOne({ post_id: req.params.id, user_id: req.user });
            res.status(200).send({
                "message": "Post unliked successfully",
                "status": "success"
            });

        } catch (error: any) {

            res.status(500).send({
                "message": error.message,
                "status": "error"
            });
        }
    }
}

export { likePost, unlikePost };