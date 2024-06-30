import mongoose, { Schema } from 'mongoose';

const media = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true },
    position: { type: Number, default: null },
    caption: { type: String, default: ''},
    type: { type: String, required: true, enum: ['image', 'video'] },
    url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Media = mongoose.model('Media', media);

export default Media;