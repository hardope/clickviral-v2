import { WebSocketServer } from "ws";
// import { IncomingMessage } from 'http';
import { authUser } from "../../../middleware/passport";
import { sendMessage } from "./sendMessage";
import { formatValidator } from "../validators";
import { Message } from "../models";

const wssMessenger = new WebSocketServer({ noServer: true });

wssMessenger.on('connection', async (ws: any, req: any) => {
    await authUser(ws, req);
    ws.user = req.user;
    ws.send(JSON.stringify({'message':'Connection successful - messenger'}));
    ws.on('message', async (message) => {
        let data = formatValidator(ws, message);
        
        if (data?.action == 'send_message') {
            sendMessage(ws, wssMessenger, data);
        } else if (data?.action == 'get_messages') {
            let userMessages = await Message.find({ 
                $or: [
                    { recipient: ws.user.id }, 
                    { sender: ws.user.id }
                ] 
            });
            ws.send(JSON.stringify(userMessages));

        } else {
            wssMessenger.clients.forEach((client: any) => {
            
                if (client.readyState === ws.OPEN && client != ws) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });
});

export {wssMessenger}