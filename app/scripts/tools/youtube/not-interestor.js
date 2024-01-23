let currentHoveredElement = null;

const mouseEnterHandler = (card) => {
    currentHoveredElement = card;
    card.style.outline = '2px solid red';
};

const mouseLeaveHandler = (card) => {
    currentHoveredElement = null;
    card.style.outline = '';
};

const resetCardsEventListener = () => {
    document.querySelectorAll('#content').forEach((card) => {
        card.removeEventListener('mouseenter', () => mouseEnterHandler(card));
        card.removeEventListener('mouseleave', () => mouseLeaveHandler(card));

        card.addEventListener('mouseenter', () => mouseEnterHandler(card));
        card.addEventListener('mouseleave', () => mouseLeaveHandler(card));
    });
};

const youtubeNotInterestor = () => {
    resetCardsEventListener();

    document.addEventListener('keyup', async ({code}) => {
        if (code === 'F9') {
            resetCardsEventListener();
            return;
        }

        if (code !== 'KeyD' || !currentHoveredElement) return;

        const menuButton = currentHoveredElement.querySelector('[aria-label="Action menu"]');
        menuButton.click();

        await new Promise((resolve) => setTimeout(() => resolve(), 100));

        const menuItems = [...document.querySelectorAll('#items > ytd-menu-service-item-renderer')];
        const notInterestedButton = menuItems.find((x) => x.textContent.toLowerCase().includes('not interested'));
        notInterestedButton?.click();
    });
};

tools['youtubeNotInterestor'] = youtubeNotInterestor;
