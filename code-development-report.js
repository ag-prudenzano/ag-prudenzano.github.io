const codeDevelopmentReport = document.querySelector("[data-code-development-report]");

if (codeDevelopmentReport) {
  const section = codeDevelopmentReport.querySelector('[data-section="code-development"]');
  const urls = (codeDevelopmentReport.dataset.codeDevelopmentUrls || "")
    .split("|")
    .map((url) => url.trim())
    .filter(Boolean);

  const addTableClass = (table, headingText) => {
    const title = headingText.toLowerCase();
    table.classList.add("code-development-table");

    if (title.includes("lifeworld dimensions")) {
      table.classList.add("code-development-lifeworld-table");
    } else if (title.includes("theme development")) {
      table.classList.add("code-development-theme-table");
    } else if (title.includes("other final codes")) {
      table.classList.add("code-development-ungrouped-table");
    } else {
      table.classList.add("code-development-coding-table");
    }
  };

  const renderPart = (markdown) => {
    const parsed = document.createElement("div");
    parsed.innerHTML = window.marked.parse(markdown);

    const fragment = document.createDocumentFragment();
    let headingText = "";

    Array.from(parsed.children).forEach((node) => {
      if (node.tagName === "H3") {
        node.textContent = node.textContent.trim().replace(/\s+[—–-]\s+/g, " – ");
        headingText = node.textContent;
        fragment.appendChild(node);
        return;
      }

      if (node.tagName === "TABLE") {
        addTableClass(node, headingText);
        const wrapper = document.createElement("div");
        wrapper.className = "live-report-table-wrap";
        wrapper.appendChild(node);
        fragment.appendChild(wrapper);
        return;
      }

      fragment.appendChild(node);
    });

    return fragment;
  };

  const showError = () => {
    const loading = section?.querySelector(".live-report-loading");
    if (loading) {
      loading.textContent = "The code-development tables could not be loaded.";
      loading.classList.add("live-report-error");
    }
  };

  const loadCodeDevelopment = async () => {
    if (!section || !urls.length || !window.marked) {
      showError();
      return;
    }

    try {
      const responses = await Promise.all(
        urls.map((url) => fetch(url, { cache: "no-cache" }))
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("A code-development table request failed.");
      }

      const markdownParts = await Promise.all(
        responses.map((response) => response.text())
      );

      section.querySelector(".live-report-loading")?.remove();
      markdownParts.forEach((markdown) => section.appendChild(renderPart(markdown)));
    } catch (error) {
      showError();
      console.error(error);
    }
  };

  loadCodeDevelopment();
}
