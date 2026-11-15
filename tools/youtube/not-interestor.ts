import { sleep } from "@/utils/dom";

let currentHoveredElement: HTMLElement | null = null;

const cardListeners = new WeakMap<
  HTMLElement,
  { enter: () => void; leave: () => void }
>();

const resetCardsEventListener = () => {
  document.querySelectorAll<HTMLElement>("#content").forEach((card) => {
    const previous = cardListeners.get(card);
    if (previous) {
      card.removeEventListener("mouseenter", previous.enter);
      card.removeEventListener("mouseleave", previous.leave);
    }

    const enter = () => {
      currentHoveredElement = card;
      card.style.outline = "2px solid red";
    };
    const leave = () => {
      currentHoveredElement = null;
      card.style.outline = "";
    };

    cardListeners.set(card, { enter, leave });
    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
  });
};

export const youtubeNotInterestor = () => {
  resetCardsEventListener();

  document.addEventListener("keyup", async ({ code }) => {
    if (code === "F9") {
      resetCardsEventListener();
      return;
    }

    if (code !== "KeyD" || !currentHoveredElement) return;

    currentHoveredElement
      .querySelector<HTMLElement>('[aria-label="Action menu"]')
      ?.click();

    await sleep(100);

    const menuItems = [
      ...document.querySelectorAll<HTMLElement>(
        "#items > ytd-menu-service-item-renderer",
      ),
    ];
    menuItems
      .find((x) => x.textContent?.toLowerCase().includes("not interested"))
      ?.click();
  });
};
