import { isOpenTabsMessage } from "@/utils/messages";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.log("Hello, friend!");
  });

  browser.commands.onCommand.addListener(async (command) => {
    console.log("command:", command);

    if (!command.startsWith("run-")) return;

    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id === undefined) return;

    try {
      await browser.tabs.sendMessage(tab.id, {
        methodName: command.slice("run-".length),
      });
    } catch (error) {
      console.info("Could not reach the page:", error);
    }
  });

  browser.runtime.onMessage.addListener((message, sender) => {
    if (!isOpenTabsMessage(message)) return;

    let index = sender.tab?.index ?? 0;
    for (const url of message.openTabs) {
      browser.tabs.create({
        url,
        active: false,
        index: ++index,
        openerTabId: sender.tab?.id,
      });
    }
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    goDuckGo(tabId, changeInfo.url, tab.incognito);
  });
});

async function goDuckGo(tabId: number, url?: string, incognito?: boolean) {
  if (!incognito || !url || !url.startsWith("https://www.google.com/sorry")) {
    return;
  }

  const originalUrl = new URL(url).searchParams.get("continue");
  if (!originalUrl) return;

  const query = new URL(originalUrl).searchParams.get("q");
  const updatedUrl = `https://duckduckgo.com/?q=${query}`;

  await browser.scripting.executeScript({
    target: { tabId },
    func: (target: string) => {
      location.href = target;
    },
    args: [updatedUrl],
    injectImmediately: true,
  });
}
