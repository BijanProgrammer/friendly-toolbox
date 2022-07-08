let currentlyActiveElement = null;
let currentlyActiveElementOriginalBoxShadow = null;

const mouseMoveHandler = e => {
    e.stopPropagation();

    if (!e?.target?.style || currentlyActiveElement === e.target) return;

    if (currentlyActiveElement) currentlyActiveElement.style.boxShadow = currentlyActiveElementOriginalBoxShadow;

    currentlyActiveElement = e.target;
    currentlyActiveElementOriginalBoxShadow = e.target.style.boxShadow;

    currentlyActiveElement.style.boxShadow = 'inset 0 0 0 2px red';
};

const clickHandler = async e => {
    e.preventDefault();
    e.stopPropagation();

    document.body.focus();

    try {
        const text = currentlyActiveElement.value || currentlyActiveElement.innerText;

        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.textContent = text;

            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }

        currentlyActiveElement.style.boxShadow = currentlyActiveElementOriginalBoxShadow;
    } catch (e) {
        console.error(e);
    }

    currentlyActiveElement = null;
    currentlyActiveElementOriginalBoxShadow = null;

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('click', clickHandler, {capture: true});
};

const generalCopyThat = () => {
    document.body.focus();
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('click', clickHandler, {capture: true});
};

tools['generalCopyThat'] = generalCopyThat;
