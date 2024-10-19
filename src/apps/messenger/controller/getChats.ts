import { User } from "../../user/models";
import { Message } from "../models";

const getChats = async (ws: any, _wssMessenger: any, _data) => {
    const user = ws.user;

    const userMessages = await Message.find({
        $or: [
            { recipient: user.id },
            { sender: user.id }
        ]
    });

    const userIdsSet = new Set<string>();
    userMessages.forEach((message) => {
        if (message.sender !== user.id) {
            userIdsSet.add(`${message.sender}`);
        }
        if (message.recipient !== user.id) {
            userIdsSet.add(`${message.recipient}`);
        }
    });
    const userIds = [...userIdsSet];

    const chats = await Promise.all(userIds.map(async (id) => {
        const lastMessage = await Message.findOne({
            $or: [
                { recipient: user.id, sender: id },
                { recipient: id, sender: user.id }
            ]
        }).sort({ createdAt: -1 });

        // Assuming you have a User model to fetch user data
        const userData = await User.findById(id);

        return {
            user: userData?.toJSON(),
            lastMessage: lastMessage?.toJSON()
        };
    }));

    ws.send(JSON.stringify(chats));
}

export { getChats }