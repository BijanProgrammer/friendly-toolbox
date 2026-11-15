import "./style.css";
import { WEBSITES } from "@/tools/websites";

const runTool = async (methodName: string) => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab?.id === undefined) return;

  try {
    const response = await browser.tabs.sendMessage(tab.id, { methodName });
    console.log("response", response);
  } catch (error) {
    console.info("Could not reach the page:", error);
  }
};

const createWebsites = () => {
  const websiteTemplate =
    document.querySelector<HTMLTemplateElement>("#website-template")!;
  const toolTemplate =
    document.querySelector<HTMLTemplateElement>("#tool-template")!;
  const mainElement = document.querySelector("main")!;

  for (const website of WEBSITES) {
    const websiteElement = websiteTemplate.content.cloneNode(
      true,
    ) as DocumentFragment;

    websiteElement.querySelector("h2")!.textContent = website.title;

    const toolsListElement = websiteElement.querySelector("ul")!;

    for (const tool of website.tools) {
      const toolElement = toolTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;

      const item = toolElement.querySelector("li")!;
      item.dataset.methodName = tool.methodName;
      item.addEventListener("click", () => {
        void runTool(tool.methodName);
        window.close();
      });

      toolElement.querySelector("h3")!.textContent = tool.title;
      toolElement.querySelector("p")!.textContent = tool.description;

      toolsListElement.appendChild(toolElement);
    }

    mainElement.appendChild(websiteElement);
  }
};

createWebsites();
