import { User } from "../../user/models";
import { Message } from "../models";
import { validateMessage } from "../validators";
import { v4 as uuidv4 } from 'uuid';

const sendMessage = async (ws: any, wssMessenger: any, data) => {
    
    if (!validateMessage(ws, data)){
        return;
    }

    try {
        const recipient = await User.findById(data.recipient);
        const messageId = uuidv4();

        if (data.reply) {
            const message = await Message.findOne({ id: data.reply });
            if (message) {
                await Message.create({
                    id: messageId,
                    sender: ws.user.id,
                    recipient: recipient?.id,
                    replyid: data.reply,
                    message: data.message
                });
            }
        } else {
            Message.create({
                id: messageId,
                sender: ws.user.id,
                recipient: recipient?.id,
                message: data.message
            });
        }
        
        const recipientClient: any = Array.from(wssMessenger.clients).find((client: any) => client.user && client.user.id === recipient?.id);
        if (recipientClient) {
            if (data.reply) {
                recipientClient.send(JSON.stringify({
                    message: data.message,
                    id: messageId,
                    sender: ws.user.id,
                    replyId: data.reply
                }));
            } else {
                recipientClient.send(JSON.stringify({
                    message: data.message,
                    id: messageId,
                    sender: ws.user.id
                }));
            }
        }
    } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ message: 'Recipient not found' }));
    }
}

export { sendMessage }