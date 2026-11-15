import "@/assets/base.css";
import "./style.css";
import { savedVideos, type SavedVideo } from "@/utils/saved-videos";

const listElement = document.querySelector("ul")!;
const emptyElement = document.querySelector<HTMLElement>(".empty")!;
const exportButton = document.querySelector<HTMLButtonElement>(".export")!;
const clearButton = document.querySelector<HTMLButtonElement>(".clear")!;
const videoTemplate =
  document.querySelector<HTMLTemplateElement>("#video-template")!;

let videos: SavedVideo[] = [];

const render = (value: SavedVideo[]) => {
  videos = value;
  emptyElement.hidden = videos.length > 0;
  exportButton.disabled = clearButton.disabled = videos.length === 0;

  listElement.replaceChildren(
    ...videos.map((video) => {
      const element = videoTemplate.content.cloneNode(true) as DocumentFragment;
      element.querySelector("a")!.href = video.href;
      element.querySelector("img")!.src = video.image;
      element.querySelector("h2")!.textContent = video.title;
      element.querySelector("p")!.textContent = video.channel;
      return element;
    }),
  );
};

exportButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(videos.map((x) => x.href).join("\n"));
  exportButton.textContent = "Copied!";
  setTimeout(() => {
    exportButton.textContent = "Export";
  }, 1500);
});

clearButton.addEventListener("click", async () => {
  if (!confirm(`Remove all ${videos.length} saved videos?`)) return;
  await savedVideos.removeValue();
});

savedVideos.watch(render);
render(await savedVideos.getValue());
