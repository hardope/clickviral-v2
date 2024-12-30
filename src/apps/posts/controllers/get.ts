import { Request, Response } from "express";
import { Posts } from "../models";


const getPosts = () => {
    return async (req: Request, res: Response) => {
        try {
            // await Posts.deleteMany({});
            const posts = await Posts.find({type: 'post'}).populate('user');
            const postsData = await Promise.all(posts.map(async post => await post.toJSON(req.user)));

            res.status(200).send({
                "data": postsData,
                "message": "Posts retrieved successfully",
                "status": "success"
            });
        } catch (error) {

            res.status(500).send({
                "message": "An error occurred while retrieving posts",
                "status": "error"
            });
        }
    }
}

export { getPosts };