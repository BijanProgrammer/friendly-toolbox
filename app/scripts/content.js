chrome.runtime.onMessage.addListener(
  async (req, messageSender, sendResponse) => {
    const method = tools[req.methodName];
    const isValidRequest = !!method && typeof method === "function";

    if (!isValidRequest) {
      const error = `Method (${req.methodName}) not found!`;
      console.info(error);
      sendResponse({ error });

      return;
    }

    await method();

    const message = `Method (${req.methodName}) called successfully!`;
    console.info(message);
    sendResponse({ message });
  },
);

autoActivatedTools.forEach(async (method) => {
  await method();
});
