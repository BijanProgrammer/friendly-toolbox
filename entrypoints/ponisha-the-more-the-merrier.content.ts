export default defineContentScript({
  matches: ["*://*.ponisha.ir/*"],
  runAt: "document_start",
  world: "MAIN",
  main() {
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequest,
      body?: Document | XMLHttpRequestBodyInit | null,
    ) {
      if (typeof body === "string" && body.includes("is_open_projects")) {
        body = body.replace('"per_page":20', '"per_page":50');
      }

      originalSend.call(this, body);
    };
  },
});
