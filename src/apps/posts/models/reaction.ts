import mongoose, { Schema } from 'mongoose';

const reaction = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    reaction: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Reaction = mongoose.model('Reaction', reaction);

export default Reaction;