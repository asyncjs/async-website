import { load } from "cheerio";

/*

This script intercepts all clicks on anchor elements.

When the anchor is a local link (i.e., the same origin), it prevents the page load and fetches the HTML at the link's href.

It then updates the document's title and body with the new HTML.

When the view transitions API is available, it will use it to transition between views.

If anything goes wrong during this process we fall back to the default behavior of following the link.

*/

if (window.history && window.fetch) {
  var MATCHES_LOCAL = new RegExp("^" + window.location.origin);

  window.addEventListener(
    "click",
    function (event) {
      var anchor = event.target.closest("a");

      if (
        anchor &&
        (!anchor.target || anchor.target === "_self") &&
        typeof anchor.href === "string" &&
        MATCHES_LOCAL.test(anchor.href)
      ) {
        event.preventDefault();

        fetch(anchor.href)
          .then((response) => response.text())
          .then((html) => {
            var $ = load(html);
            var head = $("head");
            var body = $("body");
            var title = head.find("title").text();

            if (typeof window.document.startViewTransition === "function") {
              window.document.startViewTransition(function () {
                window.document.title = title;
                window.document.body.innerHTML = body.html();
                window.scrollTo(0, 0);
              });
            } else {
              window.document.title = title;
              window.document.body.innerHTML = body.html();
            }
          })
          .catch((error) => {
            if (window.console && typeof window.console.error === "function") {
              console.error(error);
            }
            window.location.href = anchor.href;
          });

        window.history.pushState({}, "", anchor.href);
      }
    },
    { passive: false }
  );
}
