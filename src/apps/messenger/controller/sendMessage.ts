    import { User } from "../../user/models";
import { Chat, Message } from "../models";
import { validateMessage } from "../validators";
import { v4 as uuidv4 } from 'uuid';
// import { getMessages } from "./getMessages";
// import { getChats } from "./getChats";

const sendMessage = async (ws: any, wssMessenger: any, data) => {
    
    if (!validateMessage(ws, data)){
        return;
    }

    try {
        
        const chat = await Chat.findById(data.chat);

        const messageId = uuidv4();
        const temp_id = data?.tempId;
        if (!chat) {
            ws.send(JSON.stringify({ message: 'Chat not found' }));
            return;
        }
        const recipient = await User.findById(chat?.users.find((user) => user != ws.user.id));
        if (data.reply) {
            const message = await Message.findOne({ id: data.reply });
            if (message) {
                await Message.create({
                    id: messageId,
                    sender: ws.user.id,
                    chat: chat?.id,
                    replyid: data.reply,
                    message: data.message
                });
            }
        } else {
            Message.create({
                id: messageId,
                sender: ws.user.id,
                chat: chat?._id,
                message: data.message
            });
            await chat?.updateOne({ last_message: messageId, messages: [...chat.messages, messageId] });
            
        }

        const recipientClient: any = Array.from(wssMessenger.clients).find((client: any) => client.user && client.user.id === recipient?.id);
        if (recipientClient) {
            if (data.reply) {
                recipientClient.send(JSON.stringify({
                    action: 'receive_message',
                    message: data.message,
                    id: messageId,
                    sender: ws.user.id,
                    replyId: data.reply,
                    chat: chat?.id
                }));
            } else {
                recipientClient.send(JSON.stringify({
                    action: 'receive_message',
                    message: data.message,
                    id: messageId,
                    sender: ws.user.id,
                    chat: chat?.id
                }));
            }
        }

        console.log(temp_id)
        ws.send(JSON.stringify({
            action: 'message_callback',
            id: messageId,  
            tempId: temp_id,
            chat: chat?.id
        }));
    } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ message: 'Recipient not found' }));
    }
}

export { sendMessage }