const interceptXhr = () => {
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (...args) {
    if (args[0] && typeof args[0] === "string") {
      if (args[0].includes("is_open_projects")) {
        args[0] = args[0].replace('"per_page":20', '"per_page":50');
      }
    }

    originalSend.apply(this, args);
  };
};

const theMoreTheMerrier = () => {
  interceptXhr();
};

theMoreTheMerrier();
