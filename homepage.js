const methodOptions = document.querySelector(".homepage-method-options");
const methodButtons = Array.from(document.querySelectorAll("[data-method-filter]"));

function positionMethodIndicator(button) {
  if (!methodOptions || !button) {
    return;
  }

  methodOptions.style.setProperty("--method-indicator-x", `${button.offsetLeft}px`);
  methodOptions.style.setProperty("--method-indicator-width", `${button.offsetWidth}px`);
}

for (const button of methodButtons) {
  button.addEventListener("click", () => {
    for (const candidate of methodButtons) {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    }

    positionMethodIndicator(button);
    document.documentElement.dataset.method = button.dataset.methodFilter;
    document.dispatchEvent(new CustomEvent("homepage:methodchange", {
      detail: { method: button.dataset.methodFilter }
    }));
  });
}

const selectedMethod = methodButtons.find(
  button => button.getAttribute("aria-pressed") === "true"
);

positionMethodIndicator(selectedMethod);

if (methodOptions && "ResizeObserver" in window) {
  const methodResizeObserver = new ResizeObserver(() => {
    const currentMethod = methodButtons.find(
      button => button.getAttribute("aria-pressed") === "true"
    );
    positionMethodIndicator(currentMethod);
  });

  methodResizeObserver.observe(methodOptions);
}
