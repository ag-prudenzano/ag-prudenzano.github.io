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
const researchList = document.querySelector("[data-research-list]");
const researchEmpty = document.querySelector("[data-research-empty]");
const researchItems = researchList
  ? Array.from(researchList.querySelectorAll(".study-item"))
  : [];
const researchGroups = researchList
  ? Array.from(researchList.querySelectorAll("[data-research-group]"))
  : [];
const defaultResearchCategory = researchList?.dataset.researchCategory;

if (researchFilterButtons.length && researchList && researchEmpty) {
  const applyResearchFilter = (filter) => {
    let visibleItems = 0;

    researchItems.forEach((item) => {
      const itemCategory =
        item.dataset.researchCategory || defaultResearchCategory;
      const isVisible = filter === "all" || itemCategory === filter;
      item.hidden = !isVisible;
      if (isVisible) visibleItems += 1;
    });

    researchGroups.forEach((group) => {
      const hasVisibleItems = Array.from(
        group.querySelectorAll(".study-item")
      ).some((item) => !item.hidden);
      group.hidden = !hasVisibleItems;
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

const portfolioFilterButtons = Array.from(
  document.querySelectorAll("[data-portfolio-filter]")
);
const portfolioList = document.querySelector("[data-portfolio-list]");
const portfolioEmpty = document.querySelector("[data-portfolio-empty]");
const portfolioItems = portfolioList
  ? Array.from(portfolioList.querySelectorAll(".research-entry"))
  : [];
const portfolioMethodLabels = {
  quantitative: "Quantitative",
  qualitative: "Qualitative",
  "mixed-methods": "Mixed-Methods",
};

document.querySelector(".portfolio-filter-note")?.remove();

portfolioItems.forEach((item) => {
  const methodLabel = item.querySelector(".research-entry-type");
  const projectTypeLabel = item.querySelector(".portfolio-entry-kind");

  if (methodLabel) {
    methodLabel.textContent = portfolioMethodLabels[item.dataset.method] || "";
  }

  if (projectTypeLabel) {
    projectTypeLabel.textContent =
      item.dataset.projectType === "real"
        ? "Real project"
        : "Simulated case study";
  }
});

if (
  portfolioFilterButtons.length &&
  portfolioList &&
  portfolioEmpty &&
  portfolioItems.length
) {
  const portfolioFilters = {
    method: "all",
    projectType: "all",
  };

  const applyPortfolioFilters = () => {
    let visibleItems = 0;

    portfolioItems.forEach((item) => {
      const matchesMethod =
        portfolioFilters.method === "all" ||
        item.dataset.method === portfolioFilters.method;
      const matchesProjectType =
        portfolioFilters.projectType === "all" ||
        item.dataset.projectType === portfolioFilters.projectType;
      const isVisible = matchesMethod && matchesProjectType;

      item.hidden = !isVisible;
      if (isVisible) visibleItems += 1;
    });

    portfolioFilterButtons.forEach((button) => {
      const dimension = button.dataset.portfolioFilter;
      const value = button.dataset.filterValue || "all";
      const selectedValue =
        dimension === "project-type"
          ? portfolioFilters.projectType
          : portfolioFilters.method;
      const isActive = value === selectedValue;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    portfolioList.hidden = visibleItems === 0;
    portfolioEmpty.hidden = visibleItems !== 0;
  };

  portfolioFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dimension = button.dataset.portfolioFilter;
      const value = button.dataset.filterValue || "all";

      if (dimension === "project-type") {
        portfolioFilters.projectType = value;
      } else {
        portfolioFilters.method = value;
      }

      applyPortfolioFilters();
    });
  });

  applyPortfolioFilters();
}
