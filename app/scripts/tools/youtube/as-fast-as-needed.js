const OFFSETS = {
    ArrowUp: 1,
    ArrowDown: -1,
};

const CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE = new Set([
    'Viva La Dirt League',
    "Let's Game It Out",
    'Basically Homeless',
    'A24',
    '12th Hour',
    'Hyperplexed',
    'CarbotAnimations',
    '20th Century Studios',
    'SooriLand',
    'CircleToonsHD',
    'CinemaStix',
    'Comedy Central',
    'Comedy Central Stand-Up',
    "Don't Tell Comedy",
    'Vsauce',
    'Sony Pictures Entertainment',
    'Rotten Tomatoes Trailers',
    'AfroSenju XL',
    'Chris and Jack',
    'Jäger Himself Too',
]);

const CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE = new Map([
    ['Fireship', 1.5],
    ['Beyond Fireship', 1.5],
]);

const getVideoElement = async () => {
    return await waitForElementToExist('#movie_player video');
};

const changePlaybackRate = async (playbackRate) => {
    const video = await getVideoElement();
    video.playbackRate = playbackRate;

    console.info(`Playback rate changed to ${playbackRate}`);
};

const initializePlaybackRate = async (element) => {
    const channelName = element.innerText;

    if (CHANNELS_THAT_SHOULD_HAVE_NORMAL_PLAYBACK_RATE.has(channelName)) {
        await changePlaybackRate(1);
    } else if (CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.has(channelName)) {
        await changePlaybackRate(CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.get(channelName));
    } else {
        await changePlaybackRate(2);
    }
};

const documentKeyUpHandler = async (e) => {
    if (!e.ctrlKey || !Object.keys(OFFSETS).includes(e.code)) return;

    const video = await getVideoElement();
    const offset = OFFSETS[e.code] / (e.altKey ? 2 : 1);
    const playbackRate = Math.max(0.5, Math.min(video.playbackRate + offset, 3));

    await changePlaybackRate(playbackRate);
};

const waitForElementToExist = async (selector) => {
    return new Promise((resolve) => {
        let element = document.querySelector(selector);

        if (element) {
            return resolve(element);
        }

        const observer = new MutationObserver(() => {
            element = document.querySelector(selector);

            if (element) {
                resolve(element);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
};

const initialize = async () => {
    document.removeEventListener('keyup', documentKeyUpHandler);
    document.addEventListener('keyup', documentKeyUpHandler);

    const channelNameElement = await waitForElementToExist('ytd-video-owner-renderer #channel-name');
    await initializePlaybackRate(channelNameElement);
};

const reInitializeIfNeeded = async () => {
    const observer = new MutationObserver(async (records) => {
        for (const record of records) {
            if (record.attributeName === 'src' && !!record.target.src) {
                await initialize();
            }
        }
    });

    const videoElement = await getVideoElement();
    observer.observe(videoElement, {
        attributes: true,
    });
};

const asFastAsNeeded = async () => {
    if (!location.origin.includes('youtube')) return;

    await initialize();
    await reInitializeIfNeeded();
};

autoActivatedTools.push(asFastAsNeeded);
