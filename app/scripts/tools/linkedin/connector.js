(function () {
    const PERSON_SELECTOR = '.discover-fluid-entity-list--item';
    const CONNECT_BUTTON_SELECTOR = 'button[aria-label="Invite {:member} to connect"]';

    const WORDLIST = ['front', 'web', 'develop', 'ui', 'ux'];

    const INTERVAL = 250;

    const sent = new Set();
    const queue = [];
    let interval;

    const isPersonOfInterest = (project) => {
        const text = project.textContent.toLowerCase();
        return WORDLIST.some((item) => text.includes(item));
    };

    const observePeople = () => {
        const observer = new MutationObserver(() => {
            const people = [...document.querySelectorAll(PERSON_SELECTOR)];
            const desiredPeople = people.filter(isPersonOfInterest);

            desiredPeople.forEach((person) => {
                if (sent.has(person)) {
                    return;
                }

                queue.unshift(person);
            });
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    };

    const connect = () => {
        if (interval) {
            clearInterval(interval);
        }

        interval = setInterval(() => {
            const person = queue.pop();
            if (!person) {
                return;
            }

            person.style.outline = '4px solid lime';

            const connectButton = person.querySelector(CONNECT_BUTTON_SELECTOR);
            connectButton?.click();

            sent.add(person);
        }, INTERVAL);
    };

    tools['linkedinConnector'] = async () => {
        if (location.origin.includes('linkedin')) {
            observePeople();
            connect();
        }
    };
})();
