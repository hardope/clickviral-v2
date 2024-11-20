import { User } from "../../user/models";
import { Message } from "../models";

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

export { getChats }