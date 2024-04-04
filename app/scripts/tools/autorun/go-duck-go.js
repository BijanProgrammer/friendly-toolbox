const goDuckGo = () => {
    if (!chrome.extension.inIncognitoContext) {
        return;
    }

    const url = /URL: (.+)$/.exec(document.body.textContent.trim())[1];
    if (/google.com\/search/.test(url)) {
        location.replace(url.replaceAll('google.com/search', 'duckduckgo.com/'));
    }
};

goDuckGo();
