const snappfoodImageVisibler = () => {
    document.querySelectorAll('img[alt="foods icon"]').forEach((x) => (x.style.opacity = '0'));
};

tools['snappfoodImageVisibler'] = snappfoodImageVisibler;
