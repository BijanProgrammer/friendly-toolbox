const Origins = {PONISHA: 'ponisha', PARSCODERS: 'parscoders'};

const SELECTORS = {
    [Origins.PONISHA]: '#__next > .mainlayout-container > .main-wrapper > div > div > .MuiBox-root > div > div.no-ssr',
    [Origins.PARSCODERS]: '.project-list-item',
};

const BLACKLIST = [
    'wordpress',
    'joomla',
    'elementor',
    'woocommerce',
    'flutter',
    'unity ',
    'unreal',
    'matlab',
    'autocad',
    'c++',
    'وردپرس',
    'ورد پرس',
    'جوملا',
    'المنتور',
    'ووکامرس',
    'فلاتر',
    'متلب',
];

const isWordpless = (project) => {
    const text = project.textContent.toLowerCase();
    return BLACKLIST.some((item) => text.includes(item));
};

const observeProjects = (origin) => {
    const observer = new MutationObserver(() => {
        const projects = [...document.querySelectorAll(SELECTORS[origin])];
        const wordplessProjects = projects.filter(isWordpless);

        wordplessProjects.forEach((project) => {
            project.style.display = 'none';
        });
    });

    observer.observe(document.body, {
        subtree: true,
        childList: true,
    });
};

const wordpless = async () => {
    Object.values(Origins).forEach((value) => {
        if (location.origin.includes(value)) {
            observeProjects(value);
        }
    });
};

autoActivatedTools.push(wordpless);
