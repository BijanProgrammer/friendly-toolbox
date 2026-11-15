const Origins = { PONISHA: "ponisha", PARSCODERS: "parscoders" } as const;
type Origin = (typeof Origins)[keyof typeof Origins];

const SELECTORS: Record<Origin, string> = {
  [Origins.PONISHA]:
    "#__next > .mainlayout-container > .main-wrapper > div > div > .MuiBox-root > div > div.no-ssr",
  [Origins.PARSCODERS]: ".project-list-item",
};

const BLACKLIST = [
  "wordpress",
  "joomla",
  "elementor",
  "woocommerce",
  "flutter",
  "unity ",
  "unreal",
  "matlab",
  "autocad",
  "c++",
  "وردپرس",
  "ورد پرس",
  "جوملا",
  "المنتور",
  "ووکامرس",
  "فلاتر",
  "متلب",
];

const isWordpless = (project: HTMLElement) => {
  const text = (project.textContent ?? "").toLowerCase();
  return BLACKLIST.some((item) => text.includes(item));
};

const observeProjects = (origin: Origin) => {
  const observer = new MutationObserver(() => {
    const projects = [
      ...document.querySelectorAll<HTMLElement>(SELECTORS[origin]),
    ];

    projects.filter(isWordpless).forEach((project) => {
      project.style.display = "none";
    });
  });

  observer.observe(document.body, { subtree: true, childList: true });
};

export const freelancingWordpless = () => {
  Object.values(Origins).forEach((value) => {
    if (location.origin.includes(value)) {
      observeProjects(value);
    }
  });
};
