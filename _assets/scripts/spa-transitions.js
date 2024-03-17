import { load } from "cheerio";

/*

This script intercepts all clicks on anchor elements.

When the anchor is a local link (i.e., the same origin), it prevents the page load and fetches the HTML at the link's href.

It then updates the document's title and body with the new HTML.

When the view transitions API is available, it will use it to transition between views.

If anything goes wrong during this process we fall back to the default behavior of following the link.

*/

var CACHE_TIMEOUT = 1000 * 60 * 60; // 1 hour
var MATCHES_LOCAL = new RegExp("^" + window.location.origin);

var cache = {};
var currentTransitionHref = window.location.href;

function isLocalAnchor(anchor) {
  return (
    anchor &&
    (!anchor.target || anchor.target === "_self") &&
    typeof anchor.href === "string" &&
    MATCHES_LOCAL.test(anchor.href)
  );
}

function shouldUpdateCache(href) {
  return !cache[href] || cache[href].time < Date.now() - CACHE_TIMEOUT;
}

function getPageContent(href) {
  return fetch(href).then((response) => response.text());
}

function addMouseEnterHandlers() {
  window.document.querySelectorAll("a").forEach(function (anchor) {
    if (isLocalAnchor(anchor)) {
      anchor.addEventListener("mouseenter", function mouseEnterHandler() {
        console.log(anchor.href);

        if (shouldUpdateCache(anchor.href)) {
          cache[anchor.href] = {
            time: Date.now(),
            content: getPageContent(anchor.href),
          };
        }
      });
    }
  });
}

if (window.history && window.fetch) {
  addMouseEnterHandlers();

  window.addEventListener(
    "click",
    function clickHandler(event) {
      var anchor = event.target.closest("a");

      if (isLocalAnchor(anchor)) {
        event.preventDefault();

        if (currentTransitionHref === anchor.href) {
          return;
        }

        currentTransitionHref = anchor.href;

        var gettingNewCache = shouldUpdateCache(anchor.href);

        var content = gettingNewCache
          ? getPageContent(anchor.href)
          : cache[anchor.href].content;

        if (gettingNewCache) {
          cache[anchor.href] = {
            time: Date.now(),
            content: content,
          };
        }

        content
          .then((html) => {
            var $ = load(html);
            var head = $("head");
            var body = $("body");
            var title = head.find("title").text();

            if (currentTransitionHref === anchor.href) {
              if (typeof window.document.startViewTransition === "function") {
                window.document.startViewTransition(
                  function viewTransitionHandler() {
                    window.document.title = title;
                    window.document.body.innerHTML = body.html();
                    window.scrollTo(0, 0);
                    addMouseEnterHandlers();
                  }
                );
              } else {
                window.document.title = title;
                window.document.body.innerHTML = body.html();
                addMouseEnterHandlers();
              }
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
