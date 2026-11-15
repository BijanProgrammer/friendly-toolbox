/** Sent by the popup / background to a content script to run a tool. */
export interface RunToolMessage {
  methodName: string;
}

/** Sent by a content script to the background to open links in new tabs. */
export interface OpenTabsMessage {
  openTabs: string[];
}

export const isRunToolMessage = (m: unknown): m is RunToolMessage =>
  typeof (m as RunToolMessage | null)?.methodName === "string";

export const isOpenTabsMessage = (m: unknown): m is OpenTabsMessage =>
  Array.isArray((m as OpenTabsMessage | null)?.openTabs);
