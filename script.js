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

const thesisPreviewLayer = document.querySelector("[data-thesis-preview]");
const thesisPreviewPanel = thesisPreviewLayer?.querySelector("[data-thesis-preview-panel]");
const thesisPreviewOpeners = Array.from(
  document.querySelectorAll("[data-thesis-preview-open]")
);
const thesisPreviewClosers = thesisPreviewLayer
  ? Array.from(thesisPreviewLayer.querySelectorAll("[data-thesis-preview-close]"))
  : [];
let thesisPreviewReturnFocus = null;

if (thesisPreviewLayer && thesisPreviewPanel && thesisPreviewOpeners.length) {
  const getFocusableElements = () =>
    Array.from(
      thesisPreviewPanel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("hidden"));

  const openThesisPreview = (trigger) => {
    thesisPreviewReturnFocus = trigger;
    thesisPreviewLayer.classList.add("is-open");
    thesisPreviewLayer.setAttribute("aria-hidden", "false");
    document.body.classList.add("thesis-preview-open");

    window.requestAnimationFrame(() => {
      const firstFocusable = getFocusableElements()[0];
      (firstFocusable || thesisPreviewPanel).focus();
    });
  };

  const closeThesisPreview = () => {
    if (!thesisPreviewLayer.classList.contains("is-open")) return;

    thesisPreviewLayer.classList.remove("is-open");
    thesisPreviewLayer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("thesis-preview-open");
    thesisPreviewReturnFocus?.focus();
  };

  thesisPreviewOpeners.forEach((trigger) => {
    trigger.addEventListener("click", () => openThesisPreview(trigger));
  });

  thesisPreviewClosers.forEach((button) => {
    button.addEventListener("click", closeThesisPreview);
  });

  document.addEventListener("keydown", (event) => {
    if (!thesisPreviewLayer.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeThesisPreview();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      thesisPreviewPanel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}
