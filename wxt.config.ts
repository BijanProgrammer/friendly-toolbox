import { defineConfig } from "wxt";

export default defineConfig({
  // MV3 everywhere: Firefox MV2 ignores `world: "MAIN"` content scripts.
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: "Friendly Toolbox",
    permissions: ["activeTab", "tabs", "scripting"],
    host_permissions: ["*://*.google.com/*"],
    commands: {
      "run-generalCopyThat": {
        description: "Run General's Copy That",
        suggested_key: { default: "Alt+C", mac: "Alt+C" },
      },
      "run-generalSmoothScroll": {
        description: "Run General's Smooth Scroll",
        suggested_key: { default: "Alt+S", mac: "Alt+S" },
      },
      "run-gptFlip": {
        description: "Run GPT's Flip",
        suggested_key: { default: "Alt+F", mac: "Alt+F" },
      },
      "run-youtubeSorryButNotSorry": {
        description: "Run YouTube's Sorry But Not Sorry",
        suggested_key: { default: "Alt+R", mac: "Alt+R" },
      },
    },
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "friendly-toolbox@bijanprogrammer",
          // 128 is the first version with `world: "MAIN"` content scripts.
          strict_min_version: "128.0",
          data_collection_permissions: { required: ["none"] },
        },
      },
    }),
  }),
});
