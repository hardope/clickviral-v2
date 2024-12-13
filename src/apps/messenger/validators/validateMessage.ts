const validateMessage = (ws: any, message: any) => {
    const errors: any = [];

    const requiredFields = ['message', 'chat'];

    requiredFields.forEach(field => {
        switch (field) {
            case 'message':
                if (!message.hasOwnProperty(field)) {
                    errors.push('Message is required');
                } else if (typeof message[field] !== 'string') {
                    errors.push('Message must be a string');
                }
                break;
            case 'chat':
                if (!message.hasOwnProperty(field)) {
                    errors.push('Chat is required');
                } else if (typeof message[field] !== 'string') {
                    errors.push('Chat must be a string');
                } else if (message[field].length < 1) {
                    errors.push('Chat cannot be empty');
                }
                break;
        }
    });

    if (errors.length > 0) {
        ws.send(JSON.stringify({ errors: errors }));
        return false;
    }

    return true;
}

export { validateMessage }