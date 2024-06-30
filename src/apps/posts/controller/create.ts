import { Response } from "express";
import { Posts } from "../models";

const createPost = () => {
    return async (req, res: Response) => {
        try {
            const post = new Posts(req.body);
            await post.save();

            res.status(201).send({
                "message": "Post created successfully",
                "status": "success"
            });

        } catch (error) {
            res.status(500).send({
                "message": "An error occurred while creating post",
                "status": "error"
            });
        }
    }
}

export { createPost };