import { generalCopyThat } from "./general/copy-that";
import { generalSmoothScroll } from "./general/smooth-scroll";
import { generalLinkGrabber } from "./general/link-grabber";
import { govWorkHard } from "./gov/work-hard";
import { gptFlip } from "./gpt/flip";
import { freelancingWordpless } from "./freelancing/wordpless";
import { linkedinConnector } from "./linkedin/connector";
import { snappfoodImageVisibler } from "./snappfood/image-visibler";
import { wikipediaGiveMeTheNames } from "./wikipedia/give-me-the-names";
import { youtubeAsFastAsNeeded } from "./youtube/as-fast-as-needed";
import { youtubeNotInterestor } from "./youtube/not-interestor";
import { youtubeSorryButNotSorry } from "./youtube/sorry-but-not-sorry";
import { youtubeSaver } from "./youtube/saver";
import { telewebionAsFastAsNeeded } from "./telewebion/as-fast-as-needed";

type Tool = () => void | Promise<void>;

/** Tools triggered by the popup or a keyboard shortcut. */
export const tools: Record<string, Tool> = {
  generalCopyThat,
  generalSmoothScroll,
  govWorkHard,
  gptFlip,
  linkedinConnector,
  snappfoodImageVisibler,
  wikipediaGiveMeTheNames,
  youtubeNotInterestor,
  youtubeSorryButNotSorry,
  youtubeSaver,
};

/** Tools that start on their own when a page loads. */
export const autoActivatedTools: Tool[] = [
  generalLinkGrabber,
  freelancingWordpless,
  youtubeAsFastAsNeeded,
  telewebionAsFastAsNeeded,
];
