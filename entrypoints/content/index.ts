import { isRunToolMessage } from "@/utils/messages";
import { autoActivatedTools, tools } from "@/tools";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    browser.runtime.onMessage.addListener(async (message) => {
      if (!isRunToolMessage(message)) return;

      const method = tools[message.methodName];
      if (typeof method !== "function") {
        const error = `Method (${message.methodName}) not found!`;
        console.info(error);
        return { error };
      }

      await method();

      const info = `Method (${message.methodName}) called successfully!`;
      console.info(info);
      return { message: info };
    });

    autoActivatedTools.forEach(async (method) => {
      await method();
    });
  },
});
