import { WebSocketServer } from "ws";
// import { IncomingMessage } from 'http';
import { authUser } from "../../../middleware/passport";
import { sendMessage } from "./sendMessage";
import { formatValidator } from "../validators";
import { createChat, getChats } from "./getChats";
import { getMessages } from "./getMessages";

const wssMessenger = new WebSocketServer({ noServer: true });

wssMessenger.on('connection', async (ws: any, req: any) => {

    if (req.url?.split('/').length == 3) {
        req.headers['authorization'] = 'Bearer ' + req.url.split('/')[2];
    }

    await authUser(ws, req);

    ws.user = req.user;
    ws.send(JSON.stringify({'message':'Connection successful - messenger'}));
    getChats(ws, wssMessenger, {action: 'get_chats'});  
    ws.on('message', async (message) => {

        let data = formatValidator(ws, message);
        
        if (data?.action == 'send_message') {
            sendMessage(ws, wssMessenger, data);
        } else if (data?.action == 'get_chats') {
            getChats(ws, wssMessenger, data);
        } else if (data?.action == 'get_messages') {
            getMessages(ws, wssMessenger, data);

        } else if (data?.action == 'create_chat') {
            createChat(ws, wssMessenger, data);
        } else {
            ws.send(JSON.stringify({'message':'Invalid action'}));
        }
    });
});

export {wssMessenger}