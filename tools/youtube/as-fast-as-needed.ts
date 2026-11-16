import { waitForElementToExist } from "@/utils/dom";

const OFFSETS: Record<string, number> = {
  ArrowUp: 1,
  ArrowDown: -1,
};

// Each channel is listed by its display name (shown on watch pages) and its
// @handle (the only name Shorts show). Both are matched exactly.
type Channel = [name: string, handle: string];

const TEASER_TRAILER_CHANNELS: Channel[] = [
  ["A24", "@A24"],
  ["20th Century Studios", "@20thCenturyStudios"],
  ["Warner Bros.", "@WarnerBros"],
  ["Lionsgate Movies", "@LionsgateMovies"],
  ["Sony Pictures Entertainment", "@sonypictures"],
  ["Apple TV", "@AppleTV"],
  ["Paramount Movies", "@paramountmovies"],
  ["Prime Video", "@PrimeVideo"],
  ["Disney Plus", "@disneyplus"],
  ["Netflix", "@Netflix"],
  ["Rotten Tomatoes Trailers", "@RottenTomatoesTRAILERS"],
  ["Rotten Tomatoes Indie", "@RottenTomatoesINDIE"],
  ["Rotten Tomatoes Classic Trailers", "@RottenTomatoesCLASSICTRAILERS"],
  ["ONE Media Coverage", "@OneMediaCoverage"],
  ["Amazon MGM Studios", "@AmazonMGMStudios"],
  ["SearchlightPictures", "@searchlightpictures"],
  ["STXfilms", "@STXFilms"],
  ["MUBI", "@mubi"],
  ["Movie Trailers Source", "@MovieTrailersSourceHD"],
  ["Screen Media Films", "@ScreenMediaFilms"],
];

const CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE: Channel[] = [
  ...TEASER_TRAILER_CHANNELS,
  ["Viva La Dirt League", "@VivaLaDirtLeague"],
  ["Let's Game It Out", "@LetsGameItOut"],
  ["Basically Homeless", "@BasicallyHomeless"],
  ["12th Hour", "@12th"],
  ["Hyperplexed", "@Hyperplexed"],
  ["CarbotAnimations", "@CarbotAnimations"],
  ["SooriLand", "@SooriLand"],
  ["CircleToonsHD", "@CircleToonsHD"],
  ["CinemaStix", "@CinemaStix"],
  ["Comedy Central", "@ComedyCentral"],
  ["Comedy Central Stand-Up", "@standup"],
  ["Don't Tell Comedy", "@DontTellComedy"],
  ["Vsauce", "@Vsauce"],
  ["AfroSenju XL", "@AfroSenju"],
  ["Chris and Jack", "@ChrisandJack"],
  ["Jäger Himself Too", "@JägerHimselfToo"],
  ["Jynxzi", "@Jynxzi"],
  ["Universal Pictures", "@UniversalPictures"],
];

const CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE: [Channel, number][] = [
  [["Fireship", "@Fireship"], 1.5],
  [["Beyond Fireship", "@beyondfireship"], 1.5],
  [["Juxtopposed", "@juxtopposed"], 1.5],
  [["ThePrimeagen", "@ThePrimeagen"], 1.5],
  [["The PrimeTime", "@ThePrimeTimeagen"], 1.5],
  [["Developers Digest", "@DevelopersDigest"], 1.5],
  [["The Coding Sloth", "@TheCodingSloth"], 1.5],
];

const PLAYBACK_RATES = new Map<string, number>([
  ...CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE.flatMap((channel) =>
    channel.map((key) => [key, 1] as const),
  ),
  ...CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.flatMap(([channel, rate]) =>
    channel.map((key) => [key, rate] as const),
  ),
]);

// Titles containing any of these whole words always play at normal speed.
const NORMAL_PLAYBACK_RATE_TITLE =
  /\b(trailers?|teasers?|promos?|sneak peeks?)\b/i;

type VideoInfo = { channelName: string; title: string };

const getPlaybackRate = ({ channelName, title }: VideoInfo) =>
  NORMAL_PLAYBACK_RATE_TITLE.test(title)
    ? 1
    : (PLAYBACK_RATES.get(channelName) ?? 2);

type Player = { video: string; channelName: string; title: string };

const WATCH_PLAYER: Player = {
  video: "#movie_player video",
  channelName: "ytd-video-owner-renderer #channel-name a",
  title: "ytd-watch-metadata h1",
};

const SHORTS_PLAYER: Player = {
  video: "#shorts-player video",
  channelName: "ytd-reel-video-renderer yt-reel-channel-bar-view-model a",
  title: "ytd-reel-video-renderer yt-shorts-video-title-view-model h1",
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

const readText = (selector: string) =>
  document.querySelector(selector)?.textContent?.trim() ?? "";

const readVideoInfo = (player: Player): VideoInfo => ({
  channelName: readText(player.channelName),
  title: readText(player.title),
});

const VIDEO_INFO_UPDATE_TIMEOUT_MS = 1000;

// A new video's src is set before its info is rendered, so the info still
// belongs to the previous video. Wait for both to change; if one doesn't, the
// new video shares it (e.g. same channel) and the timeout ends the wait.
const waitForVideoInfoChange = (player: Player, previous: VideoInfo) =>
  new Promise<VideoInfo>((resolve) => {
    const finish = () => {
      observer.disconnect();
      clearTimeout(timeout);
      resolve(readVideoInfo(player));
    };

    const observer = new MutationObserver(() => {
      const { channelName, title } = readVideoInfo(player);
      if (
        channelName &&
        title &&
        channelName !== previous.channelName &&
        title !== previous.title
      ) {
        finish();
      }
    });
    const timeout = setTimeout(finish, VIDEO_INFO_UPDATE_TIMEOUT_MS);

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
  await waitForElementToExist(player.title);

  changePlaybackRate(video, getPlaybackRate(readVideoInfo(player)));
};

const onVideoSourceChange = async (video: HTMLVideoElement) => {
  const player = getPlayerOfVideo(video);
  if (!player) return;

  const videoInfo = await waitForVideoInfoChange(player, readVideoInfo(player));
  changePlaybackRate(video, getPlaybackRate(videoInfo));
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
