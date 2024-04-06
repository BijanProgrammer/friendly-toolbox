chrome.runtime.onInstalled.addListener(() => {
    console.log('Hello, friend!');
});

chrome.commands.onCommand.addListener((command) => {
    console.log('command:', command);

    if (!command.startsWith('run-')) return;

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {methodName: command.substr(4)}, () => {});
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!tab.incognito || !changeInfo.url || !changeInfo.url.startsWith('https://www.google.com/sorry')) {
        return;
    }

    const originalUrl = new URL(changeInfo.url).searchParams.get('continue');
    const query = new URL(originalUrl).searchParams.get('q');
    const updatedUrl = `https://duckduckgo.com/?q=${query}`;

    chrome.scripting
        .executeScript({
            target: {tabId},
            func: (updatedUrl) => {
                location.href = updatedUrl;
            },
            args: [updatedUrl],
            injectImmediately: true,
        })
        .then();
});
