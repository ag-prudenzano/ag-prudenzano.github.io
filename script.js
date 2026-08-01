const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
if (header) {
  header.style.maxWidth = "none";
  header.style.margin = "0";
  header.style.borderBottom = "0";
}

const cvUrl = "https://andreaprudenzano.craft.me/UqIWkGUKM1rHyt";
document.querySelectorAll(`a[href="${cvUrl}"]`).forEach((link) => {
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

if (menuToggle && mobileMenu) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!header?.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });
}

const researchFilterButtons = Array.from(
  document.querySelectorAll("[data-research-filter]")
);
const researchItems = Array.from(
  document.querySelectorAll("[data-research-category]")
);
const researchList = document.querySelector("[data-research-list]");
const researchEmpty = document.querySelector("[data-research-empty]");

if (researchFilterButtons.length && researchList && researchEmpty) {
  const applyResearchFilter = (filter) => {
    let visibleItems = 0;

    researchItems.forEach((item) => {
      const isVisible =
        filter === "all" || item.dataset.researchCategory === filter;
      item.hidden = !isVisible;
      if (isVisible) visibleItems += 1;
    });

    researchFilterButtons.forEach((button) => {
      const isActive = button.dataset.researchFilter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    researchList.hidden = visibleItems === 0;
    researchEmpty.hidden = visibleItems !== 0;
  };

  researchFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyResearchFilter(button.dataset.researchFilter || "all");
    });
  });

  applyResearchFilter("all");
}
