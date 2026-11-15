export interface SavedVideo {
  id: string;
  href: string;
  title: string;
  channel: string;
  image: string;
}

/** Videos saved by the YouTube Saver tool, in the order they were saved. */
export const savedVideos = storage.defineItem<SavedVideo[]>(
  "local:savedVideos",
  { fallback: [] },
);

let pending = Promise.resolve();

/** Appends a video unless one with the same id is already saved. */
export const addSavedVideo = (video: SavedVideo): Promise<void> => {
  // Serialize read-modify-write so rapid clicks can't drop each other's video.
  pending = pending.then(async () => {
    const videos = await savedVideos.getValue();
    if (videos.some((x) => x.id === video.id)) return;
    await savedVideos.setValue([...videos, video]);
  });
  return pending;
};
