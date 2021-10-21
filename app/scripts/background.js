chrome.runtime.onInstalled.addListener(() => {
    console.log('Hello, friend!');
});

chrome.commands.onCommand.addListener(command => {
    console.log('command:', command);

    if (!command.startsWith('run-')) return;

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {methodName: command.substr(4)}, () => {});
    });
});
