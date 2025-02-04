const youtubeSorryButNotSorry = () => {
  const text = document
    .querySelector("body > div:nth-child(1) > div")
    .innerText.trim();
  const lastLine = text.split("\n").reverse()[0];
  const url = lastLine.match(/URL: (.+)/)[1];

  location.replace(url);
};

tools["youtubeSorryButNotSorry"] = youtubeSorryButNotSorry;
