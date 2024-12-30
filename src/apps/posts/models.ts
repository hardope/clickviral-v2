import mongoose, { Schema } from "mongoose";
import { User } from "../user/models";

const posts = new Schema({
    title: { type: String, required: false, default: '' },
    content: { type: String, required: false, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    parent_post_id: { type: Schema.Types.ObjectId, ref: 'Posts', required: false },
    type: { type: String, required: true, enum: ['comment', 'post'], default: 'post' }
})

const media = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    media_obj: { type: String, required: true },
    media_type: { type: String, required: true, enum: ['image', 'video'] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

const likes = new Schema({
    post_id: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now }
});

// likes.index({ post: 1, user_id: 1 }, { unique: true });

const PostLikes = mongoose.model('PostLikes', likes);

posts.methods.toJSON = async function(userId: string) {

    const postObject = this.toObject();

    // const user = await User.findById(postObject.user_id);
    // postObject.user = user?.toJSON();

    const user = await User.findById(postObject.user._id).then(user => user?.toJSON());

    postObject.user = user;

    delete postObject.__v;
    postObject.id = postObject._id;
    delete postObject._id;
    postObject.isLiked = false;
    postObject.likes = 0;
    postObject.comments = 0
    const isLiked = await PostLikes.findOne({ post_id: postObject.id, user_id: userId });
    postObject.isLiked = isLiked ? true : false;
    postObject.likes = await PostLikes.countDocuments({ post_id: postObject.id });
    postObject.comments = await Posts.countDocuments({ parent_post_id: postObject.id });
    return postObject;
}

const Posts = mongoose.model('Posts', posts);
const Media = mongoose.model('Media', media);

export { Posts, Media, PostLikes };