document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("header-toggle");
  const navBar = document.getElementById("nav-bar");
  const body = document.body;
  const header = document.getElementById("header");

  if (toggleButton && navBar && header && body) {
    navBar.classList.add("show");
    toggleButton.classList.add("bx-x");
    body.classList.add("body-pd");
    header.classList.add("body-pd");

    toggleButton.addEventListener("click", function () {
      navBar.classList.toggle("show");
      toggleButton.classList.toggle("bx-x");
      body.classList.toggle("body-pd");
      header.classList.toggle("body-pd");
    });
  }

  const navLinks = document.querySelectorAll(".nav_link");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      const hasSubmenu = this.nextElementSibling && this.nextElementSibling.classList.contains("sub-menu");

      if (hasSubmenu) {
        e.preventDefault();
        const submenu = this.nextElementSibling;
        submenu.classList.toggle("show");
        return;
      }
    });
  });

  const logoutLink = document.getElementById("logout-link");
  const settingsLink = document.getElementById("settings-link");
  const dashboardLink = document.getElementById("dashboard-link");
  const academicApplicationLink = document.getElementById("academic-application-link");
  const reportLink = document.getElementById("report-link");
  const privateApplicationLink = document.getElementById("private-application-link");
  const sportsApplicationLink = document.getElementById("sports-application-link");
  const barboardApplicationLink = document.getElementById("barboard-application-link");
  const honorApplicationLink = document.getElementById("honor-application-link");
  const skApplicationLink = document.getElementById("sk-application-link");
  const oslApplicationLink = document.getElementById("osl-application-link");
  const chipinApplicationLink = document.getElementById("chipin-application-link");

  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "../../login/pages/login.html";
    });
  }

  if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "settings.html";
    });
  }

  if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "dashboard.html";
    });
  }

  if (academicApplicationLink) {
    academicApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-academic.html";
    });
  }
  if (reportLink) {
    reportLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "report.html";
    });
  }
  if (privateApplicationLink) {
    privateApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-private.html";
    });
  }
  if (sportsApplicationLink) {
    sportsApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-sports.html";
    });
  }
  if (barboardApplicationLink) {
    barboardApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-barboard.html";
    });
  }
  if (honorApplicationLink) {
    honorApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-honor.html";
    });
  }
  if (skApplicationLink) {
    skApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-sk.html";
    });
  }
  if (oslApplicationLink) {
    oslApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-osl.html";
    });
  }
  if (chipinApplicationLink) {
    chipinApplicationLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "application-chipin.html";
    });
  }
});
