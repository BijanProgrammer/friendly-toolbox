const createWebsites = () => {
    const websiteTemplate = document.querySelector('#website-template');
    const toolTemplate = document.querySelector('#tool-template');

    const mainElement = document.querySelector('main');

    for (const website of WEBSITES) {
        const websiteElement = websiteTemplate.content.cloneNode(true);

        websiteElement.querySelector('h2').textContent = website.title;

        const toolsListElement = websiteElement.querySelector('ul');

        for (const tool of website.tools) {
            const toolElement = toolTemplate.content.cloneNode(true);

            toolElement.querySelector('li').setAttribute('data-method-name', tool.methodName);
            toolElement.querySelector('h3').textContent = tool.title;
            toolElement.querySelector('p').textContent = tool.description;

            toolsListElement.appendChild(toolElement);
        }

        mainElement.appendChild(websiteElement);
    }
};

const addEventListeners = () => {
    const items = document.querySelectorAll('main > section > ul > li');

    items.forEach(item => {
        item.addEventListener('click', () => {
            console.log('clicked!');

            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                console.log('tabs', tabs);

                const methodName = item.getAttribute('data-method-name');

                chrome.tabs.sendMessage(tabs[0].id, {methodName}, response => {
                    console.log('response', response);
                });
            });
        });
    });
};

const main = () => {
    createWebsites();
    addEventListeners();
};

main();
