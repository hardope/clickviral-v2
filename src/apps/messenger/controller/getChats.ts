import { User } from "../../user/models";
import { Message, Chat } from "../models";


const createChat = async (ws: any, _wssMessenger: any, data) => {
    const user = ws.user;
    console.log(data.recipient);
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
    console.log(recipient);

    if (!recipient) {
        ws.send(JSON.stringify({
            action: 'create_chat',
            status: false,
            message: 'Recipient not found'
        }));
        return;
    }

    const existingChat = await Chat.findOne({
        type: 'private',
        users: { $all: [user.id, recipient.id] }
    });

    console.log(existingChat)

    if (existingChat) {
        console.log("----------------------------------");
        ws.send(JSON.stringify({
            action: 'create_chat',
            status: false,
            message: 'chat already exists',
            chat: existingChat.toJSON()
        }));

        return;
    }

    const chat = await new Chat({
        initialized_by: user.id,
        users: [user.id, recipient.id]
    });

    console.log(chat.toJSON());

    ws.send(JSON.stringify({
        action: 'create_chat',
        chat: await chat.toJSON()
    }));
}

const getChats = async (ws: any, _wssMessenger: any, _data) => {
    const user = ws.user;

    if (!user || !user.id) {
        console.error("User or user ID is not defined");
        return;
    }

    // Fetch all messages involving the user in one query
    const userMessages = (await Message.find({
        $or: [
            { recipient: user.id },
            { sender: user.id }
        ]
    }).sort({ created_at: -1 })).map(message => message.toJSON());
    // Use a Map to store the latest message for each user
    const latestMessagesMap = new Map<string, any>();

    userMessages.forEach((message) => {
        const otherUserId = message.sender === user.id ? message.recipient : message.sender;
        const existingMessage = latestMessagesMap.get(`${otherUserId}`);

        if (!existingMessage || new Date(message.created_at) > new Date(existingMessage.createdAt)) {
            latestMessagesMap.set(`${otherUserId}`, message);
        }
    });

    const userIds = Array.from(latestMessagesMap.keys());

    // Fetch all user data in one query
    const users = await User.find({ _id: { $in: userIds } });
    const usersMap = new Map(users.map(user => [user._id.toString(), user.toJSON()]));

    const chats = userIds.map(id => {
        const lastMessage = latestMessagesMap.get(id);
        const userData = usersMap.get(id);

        return {
            user: userData,
            lastMessage: lastMessage,
            unread: userMessages.filter(message => message.read === false && `${message.sender}` === id).length
        };
    });

    ws.send(JSON.stringify({
        action: 'get_chats',
        chats
    }));
}

export { getChats, createChat };