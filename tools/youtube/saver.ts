import { addSavedVideo, type SavedVideo } from "@/utils/saved-videos";

// While on, clicking a grid card saves the video instead of opening it.
// Running the tool again turns it off.

const CARD_SELECTOR = "ytd-rich-item-renderer";
const SAVED_OUTLINE = "3px solid #2e7d32";

let badge: HTMLDivElement | null = null;

const readChannel = (card: HTMLElement): string => {
  const channelLink = [
    ...card.querySelectorAll<HTMLAnchorElement>(
      'a[href*="/@"], a[href*="/channel/"]',
    ),
  ].find((a) => a.textContent?.trim());
  if (channelLink) return channelLink.textContent!.trim();

  // Cards on a channel page don't name the channel; the page URL does.
  return /^\/@([^/]+)/.exec(location.pathname)?.[1] ?? "";
};

const readVideo = (card: HTMLElement): SavedVideo | null => {
  const link = card.querySelector<HTMLAnchorElement>('a[href*="watch?v="]');
  if (!link) return null;

  const id = new URL(link.href).searchParams.get("v");
  if (!id) return null;

  return {
    id,
    href: `https://www.youtube.com/watch?v=${id}`,
    title: card.querySelector("h3")?.textContent?.trim() ?? "",
    channel: readChannel(card),
    image: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  };
};

const flash = (card: HTMLElement) => {
  const original = card.style.outline;
  card.style.outline = SAVED_OUTLINE;
  setTimeout(() => {
    card.style.outline = original;
  }, 600);
};

const handleClick = async (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;

  const card = event.target.closest<HTMLElement>(CARD_SELECTOR);
  if (!card) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const video = readVideo(card);
  if (!video) return;

  await addSavedVideo(video);
  flash(card);
};

const createBadge = () => {
  const el = document.createElement("div");
  el.textContent = "Saving: ON";
  Object.assign(el.style, {
    position: "fixed",
    right: "1rem",
    bottom: "1rem",
    zIndex: "2147483647",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    background: "#2e7d32",
    color: "#fff",
    font: "bold 14px sans-serif",
    pointerEvents: "none",
  });
  document.documentElement.appendChild(el);
  return el;
};

export const youtubeSaver = () => {
  if (badge) {
    document.removeEventListener("click", handleClick, true);
    badge.remove();
    badge = null;
    return;
  }

  document.addEventListener("click", handleClick, true);
  badge = createBadge();
};
