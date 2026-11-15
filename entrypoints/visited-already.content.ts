import "@/assets/visited-already.css";

export default defineContentScript({
  matches: [
    "*://*.google.com/search*",
    "*://*.ponisha.ir/dashboard/find-projects/*",
    "*://*.parscoders.com/project/*",
  ],
  main() {},
});
