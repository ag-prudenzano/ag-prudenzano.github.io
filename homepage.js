const methodOptions = document.querySelector(".homepage-method-options");
const methodButtons = Array.from(document.querySelectorAll("[data-method-filter]"));
const projectRows = Array.from(document.querySelectorAll(".homepage-project-row[data-method]"));
const projectEmpty = document.querySelector(".homepage-project-empty");

function applyProjectFilter(method) {
  let visibleProjects = 0;

  for (const row of projectRows) {
    const isVisible = method === "all" || row.dataset.method === method;
    row.hidden = !isVisible;
    if (isVisible) visibleProjects += 1;
  }

  if (projectEmpty) {
    projectEmpty.hidden = visibleProjects !== 0;
  }
}

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
    applyProjectFilter(button.dataset.methodFilter || "all");
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
applyProjectFilter(selectedMethod?.dataset.methodFilter || "all");

if (methodOptions && "ResizeObserver" in window) {
  const methodResizeObserver = new ResizeObserver(() => {
    const currentMethod = methodButtons.find(
      button => button.getAttribute("aria-pressed") === "true"
    );
    positionMethodIndicator(currentMethod);
  });

  methodResizeObserver.observe(methodOptions);
}
