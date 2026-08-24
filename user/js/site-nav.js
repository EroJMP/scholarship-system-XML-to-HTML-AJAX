(function () {
  function initSiteNav() {
    const nav = document.querySelector("nav.navbar");
    if (!nav || nav.querySelector(".nav-toggler")) return;

    const fluid = nav.querySelector(".container-fluid");
    const links = nav.querySelector(".d-none.d-lg-flex");
    if (!fluid || !links) return;

    const toggler = document.createElement("button");
    toggler.type = "button";
    toggler.className = "nav-toggler";
    toggler.setAttribute("aria-label", "Toggle navigation");
    toggler.setAttribute("aria-expanded", "false");
    toggler.innerHTML = "<span></span><span></span><span></span>";

    const actions = fluid.children[1];
    if (actions) {
      actions.classList.add("nav-actions", "d-flex", "align-items-center", "gap-2");
      actions.insertBefore(toggler, actions.firstChild);
    } else {
      fluid.appendChild(toggler);
    }

    fluid.appendChild(links);

    toggler.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      fluid.classList.toggle("nav-open", open);
      toggler.classList.toggle("is-open", open);
      toggler.setAttribute("aria-expanded", String(open));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteNav);
  } else {
    initSiteNav();
  }
})();
