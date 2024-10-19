import { User } from "../../user/models";
import { Message } from "../models";
import { validateMessage } from "../validators";

const sendMessage = async (ws: any, wssMessenger: any, data) => {
    validateMessage(ws, data);

    try {
        const recipient = await User.findById(data.recipient);

        console.log(`Recipient: ${recipient} - Sender: ${ws.user.id}`); 

        Message.create({
            sender: ws.user.id,
            recipient: recipient?.id,
            message: data.message
        });
        
        const recipientClient: any = Array.from(wssMessenger.clients).find((client: any) => client.user && client.user.id === recipient);
        if (recipientClient) {
            recipientClient.send(JSON.stringify({
                message: data.message,
                sender: ws.user.id
            }));
        }
    } catch (error) {
        ws.send(JSON.stringify({ message: 'Recipient not found' }));
    }
}

export { sendMessage }