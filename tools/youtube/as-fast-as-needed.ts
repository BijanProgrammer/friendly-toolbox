import { waitForElementToExist } from "@/utils/dom";

const OFFSETS: Record<string, number> = {
  ArrowUp: 1,
  ArrowDown: -1,
};

const TEASER_TRAILER_CHANNELS = new Set([
  "A24",
  "20th Century Studios",
  "Warner Bros. Pictures",
  "Lionsgate Movies",
  "Sony Pictures Entertainment",
  "Apple TV",
  "Paramount Movies",
  "Prime Video",
  "Disney Plus",
  "Netflix",
  "Rotten Tomatoes Trailers",
  "Rotten Tomatoes Indie",
  "Rotten Tomatoes Classic Trailers",
  "ONE Media Coverage",
  "Amazon MGM Studios",
  "SearchlightPictures",
  "STXfilms",
  "MUBI",
  "Movie Trailers Source",
  "Screen Media Films",
]);

const CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE = new Set([
  ...TEASER_TRAILER_CHANNELS,
  "Viva La Dirt League",
  "Let's Game It Out",
  "Basically Homeless",
  "12th Hour",
  "Hyperplexed",
  "CarbotAnimations",
  "SooriLand",
  "CircleToonsHD",
  "CinemaStix",
  "Comedy Central",
  "Comedy Central Stand-Up",
  "Don't Tell Comedy",
  "Vsauce",
  "AfroSenju XL",
  "Chris and Jack",
  "Jäger Himself Too",
  "Jynxzi",
  "Universal Pictures",
]);

const CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE = new Map([
  ["Fireship", 1.5],
  ["Beyond Fireship", 1.5],
  ["Juxtopposed", 1.5],
  ["ThePrimeagen", 1.5],
  ["The PrimeTime", 1.5],
  ["Developers Digest", 1.5],
  ["The Coding Sloth", 1.5],
]);

// Shorts show only the channel's @handle, so names are compared loosely:
// "Beyond Fireship" matches "@beyondfireship". When a handle differs from the
// display name, add the handle to the lists above.
const normalize = (channelName: string) =>
  channelName.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

const NORMAL_PLAYBACK_RATE_KEYS = new Set(
  [...CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE].map(normalize),
);

const CUSTOM_PLAYBACK_RATE_KEYS = new Map(
  [...CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE].map(([name, rate]) => [
    normalize(name),
    rate,
  ]),
);

const getPlaybackRate = (channelName: string) => {
  const key = normalize(channelName);
  if (NORMAL_PLAYBACK_RATE_KEYS.has(key)) return 1;
  return CUSTOM_PLAYBACK_RATE_KEYS.get(key) ?? 2;
};

type Player = { video: string; channelName: string };

const WATCH_PLAYER: Player = {
  video: "#movie_player video",
  channelName: "ytd-video-owner-renderer #channel-name a",
};

const SHORTS_PLAYER: Player = {
  video: "#shorts-player video",
  channelName: "ytd-reel-video-renderer yt-reel-channel-bar-view-model a",
};

// Both players stay in the page once created, so pick by the current page.
const getCurrentPlayer = () =>
  location.pathname.startsWith("/shorts/") ? SHORTS_PLAYER : WATCH_PLAYER;

const getPlayerOfVideo = (video: HTMLVideoElement) =>
  video.closest("#shorts-player")
    ? SHORTS_PLAYER
    : video.closest("#movie_player")
      ? WATCH_PLAYER
      : null;

const readChannelName = (player: Player) =>
  document.querySelector(player.channelName)?.textContent?.trim() ?? "";

const CHANNEL_NAME_UPDATE_TIMEOUT_MS = 1000;

// A new video's src is set before its channel name is rendered, so the name
// still belongs to the previous video. Wait for it to change; if it doesn't,
// the new video is from the same channel.
const waitForChannelNameChange = (player: Player, previous: string) =>
  new Promise<string>((resolve) => {
    const finish = () => {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(readChannelName(player));
    };

    const observer = new MutationObserver(() => {
      const channelName = readChannelName(player);
      if (channelName && channelName !== previous) finish();
    });
    const timeout = setTimeout(finish, CHANNEL_NAME_UPDATE_TIMEOUT_MS);

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });

const changePlaybackRate = (video: HTMLVideoElement, playbackRate: number) => {
  video.playbackRate = playbackRate;

  console.info(`Playback rate changed to ${playbackRate}`);
};

const documentKeyUpHandler = (e: KeyboardEvent) => {
  if (!e.ctrlKey || !(e.code in OFFSETS)) return;

  const video = document.querySelector<HTMLVideoElement>(
    getCurrentPlayer().video,
  );
  if (!video) return;

  const offset = OFFSETS[e.code] / (e.altKey ? 2 : 1);
  const playbackRate = Math.max(0.5, Math.min(video.playbackRate + offset, 3));

  changePlaybackRate(video, playbackRate);
};

const initializeCurrentVideo = async () => {
  const player = getCurrentPlayer();
  const video = await waitForElementToExist<HTMLVideoElement>(player.video);
  await waitForElementToExist(player.channelName);

  changePlaybackRate(video, getPlaybackRate(readChannelName(player)));
};

const onVideoSourceChange = async (video: HTMLVideoElement) => {
  const player = getPlayerOfVideo(video);
  if (!player) return;

  const channelName = await waitForChannelNameChange(
    player,
    readChannelName(player),
  );
  changePlaybackRate(video, getPlaybackRate(channelName));
};

export const youtubeAsFastAsNeeded = async () => {
  if (!location.origin.includes("youtube")) return;

  document.addEventListener("keyup", documentKeyUpHandler);

  // Watches every player, including the Shorts one created on first visit.
  new MutationObserver((records) => {
    for (const { target } of records) {
      if (target instanceof HTMLVideoElement && target.src) {
        void onVideoSourceChange(target);
      }
    }
  }).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["src"],
  });

  await initializeCurrentVideo();
};
