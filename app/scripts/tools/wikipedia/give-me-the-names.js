const wikipediaGiveMeTheNames = () => {
    document.body.focus();

    const elements = [...document.querySelectorAll('.summary')];
    const names = elements.map(x => x.innerText).map(x => x.replace(/"/g, ''));

    navigator.clipboard.writeText(names.join('\n')).then();
};

tools['wikipediaGiveMeTheNames'] = wikipediaGiveMeTheNames;
