const SECTION_SELECTOR = '[data-view-name="cohorts-section-more-suggestions"]';
const PERSON_SELECTOR = `${SECTION_SELECTOR} [data-view-name="cohort-card"]`;
const CONNECT_BUTTON_SELECTOR = 'button[aria-label^="Invite"]';

const WORDLIST = ["front", "web", "develop", "ui", "ux"];

const INTERVAL = 750;

const sent = new Set<HTMLElement>();
const queue: HTMLElement[] = [];
let interval: ReturnType<typeof setInterval> | undefined;

const isPersonOfInterest = (person: HTMLElement) => {
  const text = (person.textContent ?? "").toLowerCase();
  return WORDLIST.some((item) => text.includes(item));
};

const observePeople = () => {
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      const people = [...record.addedNodes].filter(
        (node): node is HTMLElement =>
          node instanceof HTMLElement && node.matches(PERSON_SELECTOR),
      );

      people.filter(isPersonOfInterest).forEach((person) => {
        if (sent.has(person)) return;

        queue.unshift(person);
      });
    });
  });

  observer.observe(document.body, { subtree: true, childList: true });
};

const connect = () => {
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    const person = queue.pop();
    if (!person) return;

    person.style.outline = "4px solid lime";

    person.querySelector<HTMLButtonElement>(CONNECT_BUTTON_SELECTOR)?.click();

    sent.add(person);
  }, INTERVAL);
};

export const linkedinConnector = () => {
  if (location.origin.includes("linkedin")) {
    observePeople();
    connect();
  }
};
