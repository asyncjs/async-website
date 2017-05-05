(function setupHubbub() {
  const gists = document.querySelectorAll("a[data-gist]");

  if (gists.length < 1) {
    return;
  }

  const setupWidgets = (Hubbub) => {
    Hubbub.css.avatarLink = "hubbub-avatar-link bordered";
    gists.forEach((gist) => {
      const section = document.createElement("section");
      section.setAttribute("class", "extra");
      document.querySelector("section.event-detail").appendChild(section);
      Hubbub.appendWidget(section, gist.href);
    });
  };

  const script = document.createElement("script");
  script.onload = () => setupWidgets(window.Hubbub);
  script.src = "/js/hubbub.js";
  document.body.appendChild(script);
})();
