import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/models';
// import { ASSET_HOST, ASSET_DIR } from '../../utils/environment';


const messageSchema = new Schema({
    id: { type: String, default: uuidv4() },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    chat: { type: String, ref: 'Chat', default: null },
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
    delete messageObject.recipient;
    delete messageObject.chat;
    // messageObject.id = messageObject._id;
    delete messageObject._id;
    return messageObject;
}

const chatSchema = new Schema({
    id: { type: String, default: uuidv4() },
    initialized_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['private', 'group'], default: 'private' },
    admin: { type: [String], ref: 'User', default: [] },
    users: { type: [String], ref: 'User', default: [] },
    messages: { type: [String], default: [] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_message: { type: String, ref: 'Message', default: null },
});

chatSchema.methods.toJSON = async function(loggedInUserId: string) {
    const chatObject = this.toObject();
    delete chatObject.__v;
    chatObject.id = chatObject._id;
    delete chatObject._id;

    let unread = 0;

    if (chatObject.type === 'private') {
        if (chatObject.users.length < 2) {
            chatObject.user = chatObject.users[0];
        } else {
            chatObject.user = chatObject.users.find((user) => user != loggedInUserId);
        }
        const user = await User.findById(chatObject.user);
        chatObject.user = user?.toJSON();
        delete chatObject.users;
    }

    const last_message = await Message.findOne({ id: chatObject.last_message });
    chatObject.last_message = last_message?.toJSON();

    chatObject.messages = await Promise.all(chatObject.messages.map(async (message) => {
        const messageObject = await Message.findOne({
            id: message
        });
        unread += messageObject?.read ? 0 : 1;

        return messageObject?.toJSON();
    }));

    chatObject.unread = unread;
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