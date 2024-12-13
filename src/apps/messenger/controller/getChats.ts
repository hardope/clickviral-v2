import { User } from "../../user/models";
import { Chat } from "../models";


const createChat = async (ws: any, _wssMessenger: any, data) => {
    try {
        const user = ws.user;
        if (!user || !user.id) {
            console.error("User or user ID is not defined");
            return;
        }

        if (!data.recipient) {
            ws.send(JSON.stringify({
                action: 'create_chat',
                status: false,
                message: 'Recipient is not defined'
            }));
            return;
        }

        const recipient = await User.findById(data.recipient);

        if (!recipient) {
            ws.send(JSON.stringify({
                action: 'create_chat',
                status: false,
                message: 'Recipient not found'
            }));
            return;
        }
        // await Chat.deleteMany({});
        const existingChat = await Chat.findOne({
            users: {
                $all: [user.id, recipient.id]
            },
            type: 'private'
        });

        if (existingChat) {
            ws.send(JSON.stringify({
                action: 'create_chat',
                status: false,
                message: 'chat already exists',
                chat: await existingChat.toJSON(ws.user.id)
            }));

            return;
        }

        const chat = await Chat.create({
            initialized_by: user.id,
            users: user.id === recipient.id ? [user.id] : [user.id, recipient.id]
        });

        ws.send(JSON.stringify({
            action: 'create_chat',
            status: true,
            chat: await chat.toJSON(ws.user.id)
        }));
    } catch (error) {
        ws.send(JSON.stringify({
            action: 'create_chat',
            status: false,
            message: 'An error occurred'
        }));
    }
}

const getChats = async (ws: any, _wssMessenger: any, _data) => {
    const user = ws.user;
    const users_chats = await Chat.find({
        users: {
            $in: [user.id]
        }
    })

    if (!user || !user.id) {
        console.error("User or user ID is not defined");
        return;
    }

    // Fetch all messages involving the user in one query
    const chats = await Promise.all(users_chats.map(async (chat) => {
        return await chat.toJSON(ws.user.id);
    }));

    ws.send(JSON.stringify({
        action: 'get_chats',
        chats
    }));
}

export { getChats, createChat };