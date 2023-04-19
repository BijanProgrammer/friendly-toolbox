const OFFSETS = {
    ArrowUp: 1,
    ArrowDown: -1,
};

const documentKeyUpHandler = e => {
    if (!e.ctrlKey || !Object.keys(OFFSETS).includes(e.code)) return;

    const video = document.querySelector('#movie_player video');
    const offset = OFFSETS[e.code] / (e.altKey ? 2 : 1);
    video.playbackRate = Math.max(0.5, Math.min(video.playbackRate + offset, 3));

    console.info(`Playback rate changed to ${video.playbackRate}`);
};

const asFastAsNeeded = () => {
    if (!location.origin.includes('youtube')) return;

    document.removeEventListener('keyup', documentKeyUpHandler);
    document.addEventListener('keyup', documentKeyUpHandler);
};

autoActivatedTools.push(asFastAsNeeded);
