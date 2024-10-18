import { validateMessage } from "./validateMessage";

const formatValidator = (ws: any, value: string) => {
    let parsed;
    try {
        parsed = JSON.parse(value.toString());
        return parsed;
    } catch (error) {
        ws.send(JSON.stringify({ message: 'Invalid message format' }));
        return null;
    }
}

export { 
    formatValidator,
    validateMessage
}