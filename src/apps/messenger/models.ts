import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
// import { User } from '../user/models';
// import { ASSET_HOST, ASSET_DIR } from '../../utils/environment';


const messageSchema = new Schema({
    id: { type: String, default: uuidv4() },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    replyid: { type: String, ref: 'Message', default: null },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    attachments: { type: [String], default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

messageSchema.methods.toJSON = function() {
    const messageObject = this.toObject();
    delete messageObject.__v;
    delete messageObject.updated_at;
    // messageObject.id = messageObject._id;
    delete messageObject._id;
    return messageObject;
}

const Message = mongoose.model('Message', messageSchema);

export { Message, messageSchema };