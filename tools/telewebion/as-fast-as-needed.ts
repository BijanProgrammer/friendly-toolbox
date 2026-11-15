import { sleep, waitForElementToExist } from "@/utils/dom";

const OFFSETS: Record<string, number> = {
  ArrowUp: 1,
  ArrowDown: -1,
};

const CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE = new Map([["پاورقی", 2]]);

const getVideoElement = () => waitForElementToExist<HTMLVideoElement>("#video");

const changePlaybackRate = async (playbackRate: number) => {
  const video = await getVideoElement();
  video.playbackRate = playbackRate;

  console.info(`Playback rate changed to ${playbackRate}`);
};

const initializePlaybackRate = async (element: HTMLElement) => {
  const channelName = element.innerText;

  await changePlaybackRate(
    CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.get(channelName) ?? 1,
  );
};

const initializeCurrentTime = async () => {
  const video = await getVideoElement();
  video.currentTime = Math.max(video.currentTime, 70);

  console.info(`Current time changed to ${video.currentTime}`);
};

const documentKeyUpHandler = async (e: KeyboardEvent) => {
  if (!e.ctrlKey || !(e.code in OFFSETS)) return;

  const video = await getVideoElement();
  const offset = OFFSETS[e.code] / (e.altKey ? 2 : 1);
  const playbackRate = Math.max(0.5, Math.min(video.playbackRate + offset, 3));

  await changePlaybackRate(playbackRate);
};

const skipAds = async () => {
  let skipButton: HTMLElement | null =
    await waitForElementToExist<HTMLElement>("#twp-vast-skip");

  do {
    console.log("Clicking on skip button...");

    skipButton?.click();

    await sleep(500);

    skipButton = document.querySelector<HTMLElement>("#twp-vast-skip");
  } while (skipButton);

  console.log("Skipped ads");
};

const initialize = async () => {
  document.removeEventListener("keyup", documentKeyUpHandler);
  document.addEventListener("keyup", documentKeyUpHandler);

  const channelNameElement = await waitForElementToExist<HTMLElement>(
    '[data-gtm="clip-detail-channel"]',
  );
  await initializePlaybackRate(channelNameElement);
  await initializeCurrentTime();
};

const reInitializeIfNeeded = async () => {
  const observer = new MutationObserver(async (records) => {
    for (const record of records) {
      const target = record.target as HTMLVideoElement;
      if (record.attributeName === "src" && !!target.src) {
        await initialize();
      }
    }
  });

  const videoElement = await getVideoElement();
  observer.observe(videoElement, { attributes: true });
};

export const telewebionAsFastAsNeeded = async () => {
  if (!location.origin.includes("telewebion")) return;

  const video = await getVideoElement();
  if (video.duration < 300) {
    video.muted = true;
    await skipAds();
    video.muted = false;
  }

  await initialize();
  await reInitializeIfNeeded();
};
