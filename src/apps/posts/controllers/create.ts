import { Request, Response } from "express";
import { Posts } from "../models";

const createPost = () => {
    return async (req: Request, res: Response) => {

        let newPost: any;
        if (req.body.type === 'comment') {
            if (!req.body.parent_post_id)  {
                return res.status(400).send({
                    "message": "Parent_post_id is required for comments",
                    "status": "error"
                });
            }

            const parentPost = await Posts.findById(req.body.parent_post_id);
            if (!parentPost) {
                return res.status(404).send({
                    "message": "Parent post not found",
                    "status": "error"
                });
            }

            newPost = await Posts.create({...req.body, user: req.user});
        } else {
            newPost = await Posts.create({...req.body, user: req.user});
        }
        const postsData = await newPost.toJSON(req.user);
        return res.status(201).send({
            "post": postsData,
            "message": "Post created successfully",
            "status": "success"
        });
    };

};

export { createPost };