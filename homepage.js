const methodButtons = Array.from(document.querySelectorAll("[data-method-filter]"));

for (const button of methodButtons) {
  button.addEventListener("click", () => {
    for (const candidate of methodButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }

    document.documentElement.dataset.method = button.dataset.methodFilter;
    document.dispatchEvent(new CustomEvent("homepage:methodchange", {
      detail: { method: button.dataset.methodFilter }
    }));
  });
}
