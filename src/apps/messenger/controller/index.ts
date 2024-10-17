import { WebSocketServer } from "ws";
// import { IncomingMessage } from 'http';
import { authUser } from "../../../middleware/passport";

const wssMessenger = new WebSocketServer({ noServer: true });

wssMessenger.on('connection', async (ws: any, req: any) => {
    await authUser(ws, req);
    ws.user = req.user;
    ws.send(JSON.stringify({'message':'Connection successful - messenger'}));
    ws.on('message', (message) => {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (error) {
            console.error('Invalid JSON:', error);
            return;
        }

        const data = parsedMessage;

        if (data?.action == 'send_message') {
            const recipient = data?.recipient;
            const recipientClient = Array.from(wssMessenger.clients).find((client: any) => client.user && client.user.id === recipient);
            if (recipientClient) {
                recipientClient.send(JSON.stringify({
                    message: data.message,
                    sender: ws.user.id
                }));
            }
        } else {
            wssMessenger.clients.forEach((client: any) => {
            
                if (client.readyState === ws.OPEN && client != ws) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        }
    });
});

export {wssMessenger}