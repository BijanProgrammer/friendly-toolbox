export const waitForElementToExist = <T extends Element = HTMLElement>(
  selector: string,
): Promise<T> =>
  new Promise((resolve) => {
    const existing = document.querySelector<T>(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const element = document.querySelector<T>(selector);
      if (!element) return;

      observer.disconnect();
      resolve(element);
    });

    observer.observe(document.body, { subtree: true, childList: true });
  });

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
