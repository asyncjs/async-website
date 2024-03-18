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

var cache = {
  [window.location.href]: {
    time: Date.now(),
    content: Promise.resolve(window.document.documentElement.outerHTML),
  },
};
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

function transitionTo(href, isBack) {
  if (currentTransitionHref === href) {
    return;
  }

  currentTransitionHref = href;

  var gettingNewCache = shouldUpdateCache(href);

  var content = gettingNewCache ? getPageContent(href) : cache[href].content;

  if (gettingNewCache) {
    cache[href] = {
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

      if (currentTransitionHref === href) {
        if (typeof window.document.startViewTransition === "function") {
          window.document.startViewTransition(function viewTransitionHandler() {
            window.document.title = title;
            window.document.body.innerHTML = body.html();
            window.scrollTo(0, 0);
            addMouseEnterHandlers();

            if (!isBack) {
              window.history.pushState({}, "", href);
            }
          });
        } else {
          window.document.title = title;
          window.document.body.innerHTML = body.html();
          addMouseEnterHandlers();

          if (!isBack) {
            window.history.pushState({}, "", href);
          }
        }
      }
    })
    .catch((error) => {
      if (window.console && typeof window.console.error === "function") {
        console.error(error);
      }

      if (!isBack) {
        window.location.href = href;
      }
    });
}

if (window.history && window.fetch) {
  addMouseEnterHandlers();

  window.addEventListener("popstate", function handlePopState(event) {
    transitionTo(event.target.location.href, true);
  });

  window.addEventListener(
    "click",
    function clickHandler(event) {
      var anchor = event.target.closest("a");

      if (isLocalAnchor(anchor)) {
        event.preventDefault();

        transitionTo(anchor.href);
      }
    },
    { passive: false }
  );
}
