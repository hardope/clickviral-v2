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

const chatSchema = new Schema({
    id: { type: String, default: uuidv4() },
    initialized_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admin: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    users: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    messages: { type: [messageSchema], default: [] },
    created_at: { type: Date, default: Date.now },
    last_message: { type: Schema.Types.ObjectId, ref: 'Message', default: null },
});

chatSchema.methods.toJSON = function() {
    const chatObject = this.toObject();
    delete chatObject.__v;
    chatObject.id = chatObject._id;
    delete chatObject._id;
    return chatObject;
}

const Chat = mongoose.model('Chat', chatSchema);

const Message = mongoose.model('Message', messageSchema);

export {
    Chat,
    Message,
    messageSchema,
    chatSchema
};