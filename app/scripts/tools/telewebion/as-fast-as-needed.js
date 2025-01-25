(function () {
    const OFFSETS = {
        ArrowUp: 1,
        ArrowDown: -1,
    };

    const CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE = new Map([['پاورقی', 2]]);

    const getVideoElement = async () => {
        return await waitForElementToExist('#video');
    };

    const changePlaybackRate = async (playbackRate) => {
        const video = await getVideoElement();
        video.playbackRate = playbackRate;

        console.info(`Playback rate changed to ${playbackRate}`);
    };

    const initializePlaybackRate = async (element) => {
        const channelName = element.innerText;

        if (CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.has(channelName)) {
            await changePlaybackRate(CHANNELS_THAT_SHOULD_HAVE_CUSTOM_PLAYBACK_RATE.get(channelName));
        } else {
            await changePlaybackRate(1);
        }
    };

    const initializeCurrentTime = async () => {
        const video = await getVideoElement();
        video.currentTime = Math.max(video.currentTime, 70);

        console.info(`Current time changed to ${video.currentTime}`);
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

    const skipAds = async () => {
        let skipButton = await waitForElementToExist('#twp-vast-skip');

        do {
            console.log('Clicking on skip button...');

            skipButton.click();

            await new Promise((resolve) => setTimeout(resolve, 500));

            skipButton = document.querySelector('#twp-vast-skip');
        } while (skipButton);

        console.log('Skipped ads');
    };

    const initialize = async () => {
        document.removeEventListener('keyup', documentKeyUpHandler);
        document.addEventListener('keyup', documentKeyUpHandler);

        const channelNameElement = await waitForElementToExist('[data-gtm="clip-detail-channel"]');
        await initializePlaybackRate(channelNameElement);
        await initializeCurrentTime(channelNameElement);
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
        if (!location.origin.includes('telewebion')) return;

        const video = await getVideoElement();
        if (video.duration < 300) {
            video.isMuted = true;
            await skipAds();
            video.isMuted = false;
        }

        await initialize();
        await reInitializeIfNeeded();
    };

    autoActivatedTools.push(asFastAsNeeded);
})();
