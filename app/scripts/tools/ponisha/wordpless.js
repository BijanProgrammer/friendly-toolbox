const PROJECTS_SELECTOR =
    '#__next > .mainlayout-container > .main-wrapper > div > div > .MuiBox-root > div > div.no-ssr';

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

const observeProjects = () => {
    const observer = new MutationObserver(() => {
        const projects = [...document.querySelectorAll(PROJECTS_SELECTOR)];
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
    if (!location.origin.includes('ponisha')) return;

    observeProjects();
};

autoActivatedTools.push(wordpless);
