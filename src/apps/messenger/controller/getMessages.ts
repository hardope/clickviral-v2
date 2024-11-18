// import { User } from "../../user/models";
import { Message } from "../models";

const getMessages = async (ws: any, _wssMessenger: any, data: any): Promise<any[]> => {
    try {
        const messages = await Message.find({
            $or: [
            { sender: ws.user.id, recipient: data.recipient },
            { sender: data.recipient, recipient: ws.user.id }
            ]
        }).sort({ createdAt: 1 });

        const formattedMessages = messages.map((message: any) => {
            return message.toJSON();
        });

        ws.send(JSON.stringify(formattedMessages));
        return formattedMessages;
    } catch (error) {
        console.log(error);
        ws.send(JSON.stringify({ message: 'Error fetching messages' }));
        return []
    }
}

export  { getMessages }