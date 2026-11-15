export const wikipediaGiveMeTheNames = async () => {
  document.body.focus();

  const elements = [...document.querySelectorAll<HTMLElement>(".summary")];
  const names = elements.map((x) => x.innerText.replace(/"/g, ""));

  await navigator.clipboard.writeText(names.join("\n"));
};
