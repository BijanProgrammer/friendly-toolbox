let shouldScroll = false;

const scrollSmoothly = () => {
  const startPosition = window.scrollY;
  const endPosition =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;

  let startTime: number | null = null;
  const duration = 5_000;

  window.requestAnimationFrame(function step(currentTime) {
    if (!shouldScroll) return;

    if (startTime === null) startTime = currentTime;

    const timePassed = currentTime - startTime;

    window.scrollTo(
      0,
      startPosition + ((endPosition - startPosition) * timePassed) / duration,
    );

    if (timePassed < duration) {
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, endPosition);
    }
  });
};

export const generalSmoothScroll = () => {
  shouldScroll = !shouldScroll;
  scrollSmoothly();
};
