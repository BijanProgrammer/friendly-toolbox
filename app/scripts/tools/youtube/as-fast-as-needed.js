const documentKeyUpHandler = e => {
    if (!e.ctrlKey) return;

    const video = document.querySelector('#movie_player video');
    let playbackRate = video.playbackRate;

    if (e.code === 'ArrowUp') playbackRate++;
    else if (e.code === 'ArrowDown') playbackRate--;
    else if (e.code === 'ArrowRight') playbackRate += 0.5;
    else if (e.code === 'ArrowLeft') playbackRate -= 0.5;

    video.playbackRate = Math.max(0.5, playbackRate);

    console.info(`Playback rate changed to ${video.playbackRate}`);
};

const asFastAsNeeded = () => {
    if (!location.origin.includes('youtube')) return;

    document.removeEventListener('keyup', documentKeyUpHandler);
    document.addEventListener('keyup', documentKeyUpHandler);
};

autoActivatedTools.push(asFastAsNeeded);
