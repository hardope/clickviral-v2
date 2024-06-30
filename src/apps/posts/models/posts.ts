import mongoose, { Schema } from 'mongoose';

const posts = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    tags: [{ type: String }],
    parent: { type: Schema.Types.ObjectId, ref: 'Posts', default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Posts = mongoose.model('Posts', posts);

export default Posts;