const flipContentElement = () => {
    const content = document.querySelector('#thread [slot="content"]');

    if (!content) {
        console.log('There is no content element in this page.');
        return;
    }

    if (!content.style.direction || content.style.direction === 'ltr') {
        content.style.direction = 'rtl';
    } else {
        content.style.direction = 'ltr';
    }
};

const gptFlip = () => {
    flipContentElement();
};

tools['gptFlip'] = gptFlip;
