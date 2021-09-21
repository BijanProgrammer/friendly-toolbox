chrome.runtime.onMessage.addListener((req, messageSender, sendResponse) => {
    const method = tools[req.methodName];
    const isValidRequest = !!method && typeof method === 'function';

    if (!isValidRequest) {
        const error = `Method (${req.methodName}) not found!`;
        console.info(error);
        sendResponse({error});

        return;
    }

    method();

    const message = `Method (${req.methodName}) called successfully!`;
    console.info(message);
    sendResponse({message});
});
