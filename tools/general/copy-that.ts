let activeElement: HTMLElement | null = null;
let activeElementOriginalBoxShadow: string | null = null;

const restoreActiveElement = () => {
  if (activeElement) {
    activeElement.style.boxShadow = activeElementOriginalBoxShadow ?? "";
  }
};

const mouseMoveHandler = (e: MouseEvent) => {
  e.stopPropagation();

  const target = e.target as HTMLElement | null;
  if (!target?.style || activeElement === target) return;

  restoreActiveElement();

  activeElement = target;
  activeElementOriginalBoxShadow = target.style.boxShadow;

  activeElement.style.boxShadow = "inset 0 0 0 2px red";
};

const copyText = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.textContent = text;

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const clickHandler = async (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  document.body.focus();

  try {
    const element = activeElement as HTMLInputElement | null;
    if (element) {
      await copyText(element.value || element.innerText);
      restoreActiveElement();
    }
  } catch (error) {
    console.error(error);
  }

  activeElement = null;
  activeElementOriginalBoxShadow = null;

  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("click", clickHandler, { capture: true });
};

export const generalCopyThat = () => {
  document.body.focus();
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("click", clickHandler, { capture: true });
};
