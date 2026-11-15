export const snappfoodImageVisibler = () => {
  document
    .querySelectorAll<HTMLImageElement>('img[alt="foods icon"]')
    .forEach((x) => (x.style.opacity = "0"));
};
