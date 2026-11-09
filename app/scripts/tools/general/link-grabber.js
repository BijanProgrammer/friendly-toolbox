// Hold "z" and drag the mouse over links to open all of them in new tabs.
(() => {
  const ACTIVATION_KEY = "z";
  const EDGE_SIZE = 50; // px from viewport edge where auto-scroll starts
  const MAX_SCROLL_SPEED = 25; // px per frame
  const HIGHLIGHT_OUTLINE = "2px solid #e8710a";

  let isKeyDown = false;
  let startPoint = null; // client coordinates at mousedown
  let scroller = null; // element that scrolls while dragging
  let startScroll = null; // scroller's scroll position at mousedown
  let mousePoint = null; // client coordinates
  let box = null;
  let scrollFrame = null;
  let highlighted = new Map(); // element -> original outline

  const isTyping = (e) => {
    const el = e.target;
    return (
      el?.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName)
    );
  };

  const createBox = () => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      zIndex: "2147483647",
      border: "1px solid #1a73e8",
      background: "rgba(26, 115, 232, 0.2)",
      pointerEvents: "none",
    });
    document.documentElement.appendChild(el);
    return el;
  };

  const isDocumentScroller = (el) =>
    el === document.scrollingElement ||
    el === document.documentElement ||
    el === document.body;

  const findScroller = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      if (n === document.body) break;
      const style = getComputedStyle(n);
      const scrollableY =
        /(auto|scroll|overlay)/.test(style.overflowY) &&
        n.scrollHeight > n.clientHeight;
      const scrollableX =
        /(auto|scroll|overlay)/.test(style.overflowX) &&
        n.scrollWidth > n.clientWidth;
      if (scrollableX || scrollableY) return n;
    }
    return document.scrollingElement || document.documentElement;
  };

  // Visible area of the scroller in client coordinates.
  const getScrollerBounds = () => {
    const viewport = {
      left: 0,
      top: 0,
      right: innerWidth,
      bottom: innerHeight,
    };
    if (isDocumentScroller(scroller)) return viewport;
    const r = scroller.getBoundingClientRect();
    return {
      left: Math.max(r.left, 0),
      top: Math.max(r.top, 0),
      right: Math.min(r.right, innerWidth),
      bottom: Math.min(r.bottom, innerHeight),
    };
  };

  // Selection rectangle in client (viewport) coordinates. The start point
  // moves along with the scroller so the box grows while scrolling.
  const getClientRect = () => {
    const sx = startPoint.x - (scroller.scrollLeft - startScroll.x);
    const sy = startPoint.y - (scroller.scrollTop - startScroll.y);
    return {
      left: Math.min(sx, mousePoint.x),
      right: Math.max(sx, mousePoint.x),
      top: Math.min(sy, mousePoint.y),
      bottom: Math.max(sy, mousePoint.y),
    };
  };

  const intersects = (a, b) =>
    a.left <= b.right &&
    a.right >= b.left &&
    a.top <= b.bottom &&
    a.bottom >= b.top;

  // A link is really visible when nothing hides it: not visibility:hidden,
  // not opacity:0 (on itself or an ancestor), and not clipped by an
  // overflow container. The active scroller is exempt from clipping, since
  // links the user scrolled past inside it must stay selected.
  const isActuallyVisible = (a, rect) => {
    if (getComputedStyle(a).visibility !== "visible") return false;

    let clipped = true;
    for (let n = a; n && n !== document.documentElement; n = n.parentElement) {
      const style = getComputedStyle(n);
      if (parseFloat(style.opacity) === 0) return false;

      if (n === scroller) clipped = false;
      if (n === document.body || !clipped || n === a) continue;

      if (style.overflowX !== "visible" || style.overflowY !== "visible") {
        if (!intersects(rect, n.getBoundingClientRect())) return false;
      }
    }

    return true;
  };

  const getLinksInSelection = () => {
    const selection = getClientRect();
    const links = [];

    document.querySelectorAll("a[href]").forEach((a) => {
      if (!/^https?:/i.test(a.href)) return;

      const r = a.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;

      if (!intersects(selection, r)) return;
      if (!isActuallyVisible(a, r)) return;

      links.push(a);
    });

    return links;
  };

  const clearHighlights = () => {
    highlighted.forEach((outline, a) => {
      a.style.outline = outline;
    });
    highlighted = new Map();
  };

  const update = () => {
    const r = getClientRect();
    Object.assign(box.style, {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.right - r.left}px`,
      height: `${r.bottom - r.top}px`,
    });

    const links = new Set(getLinksInSelection());

    highlighted.forEach((outline, a) => {
      if (!links.has(a)) {
        a.style.outline = outline;
        highlighted.delete(a);
      }
    });

    links.forEach((a) => {
      if (highlighted.has(a)) return;
      highlighted.set(a, a.style.outline);
      a.style.outline = HIGHLIGHT_OUTLINE;
    });
  };

  const edgeSpeed = (pos, min, max) => {
    if (pos < min + EDGE_SIZE) {
      return (
        -MAX_SCROLL_SPEED * Math.min(1, (min + EDGE_SIZE - pos) / EDGE_SIZE)
      );
    }
    if (pos > max - EDGE_SIZE) {
      return (
        MAX_SCROLL_SPEED * Math.min(1, (pos - (max - EDGE_SIZE)) / EDGE_SIZE)
      );
    }
    return 0;
  };

  const scrollLoop = () => {
    if (!startPoint) {
      scrollFrame = null;
      return;
    }

    const bounds = getScrollerBounds();
    const dx = edgeSpeed(mousePoint.x, bounds.left, bounds.right);
    const dy = edgeSpeed(mousePoint.y, bounds.top, bounds.bottom);

    if (dx || dy) {
      scroller.scrollBy(dx, dy);
      update();
    }

    scrollFrame = requestAnimationFrame(scrollLoop);
  };

  const cancel = () => {
    box?.remove();
    box = null;
    startPoint = null;
    scroller = null;
    clearHighlights();
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = null;
  };

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === ACTIVATION_KEY && !isTyping(e)) {
      isKeyDown = true;
    } else if (e.key === "Escape") {
      cancel();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === ACTIVATION_KEY) isKeyDown = false;
  });

  window.addEventListener("blur", () => {
    isKeyDown = false;
    cancel();
  });

  document.addEventListener(
    "mousedown",
    (e) => {
      if (!isKeyDown || e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      mousePoint = { x: e.clientX, y: e.clientY };
      startPoint = { ...mousePoint };
      scroller = findScroller(e.target);
      startScroll = { x: scroller.scrollLeft, y: scroller.scrollTop };
      box = createBox();
      update();
      scrollFrame = requestAnimationFrame(scrollLoop);
    },
    true,
  );

  document.addEventListener(
    "mousemove",
    (e) => {
      if (!startPoint) return;
      e.preventDefault();
      mousePoint = { x: e.clientX, y: e.clientY };
      update();
    },
    true,
  );

  document.addEventListener(
    "mouseup",
    (e) => {
      if (!startPoint) return;

      e.preventDefault();
      e.stopPropagation();

      mousePoint = { x: e.clientX, y: e.clientY };
      const urls = [...new Set(getLinksInSelection().map((a) => a.href))];

      cancel();

      if (urls.length > 0) {
        chrome.runtime.sendMessage({ openTabs: urls });
      }
    },
    true,
  );

  // Swallow the click that follows a drag so no link gets followed.
  document.addEventListener(
    "click",
    (e) => {
      if (isKeyDown) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );
})();
