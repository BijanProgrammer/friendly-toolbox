const flipContentElement = () => {
  const messages = document.querySelectorAll("[data-message-id]");

  if (!messages.length) {
    console.log("There is no message in this page.");
    return;
  }

  messages.forEach((message) => {
    if (!message.style.direction || message.style.direction === "ltr") {
      message.style.direction = "rtl";
    } else {
      message.style.direction = "ltr";
    }
  });
};

const gptFlip = () => {
  flipContentElement();
};

tools["gptFlip"] = gptFlip;
