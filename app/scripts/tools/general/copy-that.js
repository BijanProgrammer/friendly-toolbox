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
    await navigator.clipboard.writeText(currentlyActiveElement.value || currentlyActiveElement.innerText);

    if (currentlyActiveElement) currentlyActiveElement.style.boxShadow = currentlyActiveElementOriginalBoxShadow;

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
