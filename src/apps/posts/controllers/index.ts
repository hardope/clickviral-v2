import { getComments } from "./comments";
import { createPost } from "./create";
import { getPosts } from "./get";
import { likePost, unlikePost } from "./like";


const postController = {
    createPost,
    getPosts,
    likePost,
    unlikePost,
    getComments
}

export default postController;
