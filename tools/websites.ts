import type { PublicPath } from "wxt/browser";

/**
 * Popup metadata. An entry either runs a tool on the page (implementations
 * live in `tools/index.ts`) or opens one of the extension's pages in a tab.
 */
export type ToolInfo = {
  title: string;
  description: string;
} & ({ methodName: string } | { page: PublicPath });

export interface Website {
  title: string;
  tools: ToolInfo[];
}

export const WEBSITES: Website[] = [
  {
    title: "General",
    tools: [
      {
        methodName: "generalCopyThat",
        title: "Copy That",
        description:
          "Hover on any element in the page and click to copy it's text.",
      },
      {
        methodName: "generalSmoothScroll",
        title: "Smooth Scroll",
        description: "Smoothly scrolls to the bottom of the page.",
      },
    ],
  },
  {
    title: "GPT",
    tools: [
      {
        methodName: "gptFlip",
        title: "Flip",
        description: "Flips the direction of the content element in ChatGPT.",
      },
    ],
  },
  {
    title: "LinkedIn",
    tools: [
      {
        methodName: "linkedinConnector",
        title: "Connector",
        description:
          "Automatically sends connection request to suggested people on the page.",
      },
    ],
  },
  {
    title: "SnappFood",
    tools: [
      {
        methodName: "snappfoodImageVisibler",
        title: "Image Visibler",
        description:
          "Hides the default placeholder image, so you can see the real image of the food on the restaurant's page.",
      },
    ],
  },
  {
    title: "Wikipedia",
    tools: [
      {
        methodName: "wikipediaGiveMeTheNames",
        title: "Give Me The Names",
        description: "Extracts episode names of the series.",
      },
    ],
  },
  {
    title: "YouTube",
    tools: [
      {
        methodName: "youtubeNotInterestor",
        title: "Not Interestor",
        description:
          "Mark the videos that you're not interested to, so they won't appear as suggested videos on YouTube's main page.",
      },
      {
        methodName: "youtubeSorryButNotSorry",
        title: "Sorry But Not Sorry",
        description:
          "When google show you the sorry page, you can use this tool to navigate to the video's url.",
      },
      {
        methodName: "youtubeSaver",
        title: "Saver",
        description:
          "Turns save mode on or off. While on, clicking a video card saves it instead of opening it.",
      },
      {
        page: "/saved-videos.html",
        title: "Saved Videos",
        description: "Lists the saved videos, to export or clear them.",
      },
    ],
  },
  {
    title: "Gov",
    tools: [
      {
        methodName: "govWorkHard",
        title: "Work Hard",
        description: "Sums up the working days in tamin.ir history.",
      },
    ],
  },
];
