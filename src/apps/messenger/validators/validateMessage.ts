const validateMessage = (ws: any, message: any) => {
    const errors: any = [];

    const requiredFields = ['message', 'recipient'];

    requiredFields.forEach(field => {
        switch (field) {
            case 'message':
                if (!message.hasOwnProperty(field)) {
                    errors.push('Message is required');
                } else if (typeof message[field] !== 'string') {
                    errors.push('Message must be a string');
                }
                break;
            case 'recipient':
                if (!message.hasOwnProperty(field)) {
                    errors.push('Recipient is required');
                } else if (typeof message[field] !== 'string') {
                    errors.push('Recipient must be a string');
                } else if (message[field].length < 1) {
                    errors.push('Recipient cannot be empty');
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