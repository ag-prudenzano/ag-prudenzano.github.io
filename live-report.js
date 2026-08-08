const liveReport = document.querySelector("[data-live-report]");

if (liveReport) {
  const reportUrl = liveReport.dataset.reportUrl;
  const rawBase = "https://raw.githubusercontent.com/ag-prudenzano/survey-response-quality-audit/main/";
  const githubBase = "https://github.com/ag-prudenzano/survey-response-quality-audit/blob/main/";

  const slugify = (value) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const normaliseUrls = (container) => {
    container.querySelectorAll("img[src]").forEach((image) => {
      const source = image.getAttribute("src");
      if (source && !/^(https?:|data:)/i.test(source)) {
        image.src = rawBase + source.replace(/^\.\//, "");
      }
    });

    container.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (!/^(https?:|mailto:|#)/i.test(href)) {
        link.href = githubBase + href.replace(/^\.\//, "");
      }

      if (/^https?:/i.test(link.href)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  };

  const buildSections = (container) => {
    const fragment = document.createDocumentFragment();
    let section = null;

    Array.from(container.children).forEach((element) => {
      if (element.tagName === "H2") {
        section = document.createElement("section");
        section.className = "live-report-section";
        section.dataset.section = slugify(element.textContent || "section");
        section.appendChild(element);
        fragment.appendChild(section);
      } else if (section) {
        section.appendChild(element);
      }
    });

    return fragment;
  };

  const enhanceFigures = (container) => {
    const section = container.querySelector('[data-section="figures"]');
    if (!section) return;

    const heading = section.querySelector(":scope > h2");
    const nodes = Array.from(section.children).filter((node) => node !== heading);
    const grid = document.createElement("div");
    grid.className = "live-report-figures";

    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.tagName !== "H3") continue;

      const figure = document.createElement("figure");
      figure.className = "live-report-figure";
      figure.appendChild(node);

      const imageParagraph = nodes[index + 1];
      const image = imageParagraph?.querySelector?.("img");
      if (image) {
        figure.appendChild(image);
        imageParagraph.remove();
        index += 1;
      }

      const captionParagraph = nodes[index + 1];
      if (captionParagraph?.tagName === "P" && !captionParagraph.querySelector("img")) {
        const caption = document.createElement("figcaption");
        caption.innerHTML = captionParagraph.innerHTML;
        figure.appendChild(caption);
        captionParagraph.remove();
        index += 1;
      }

      grid.appendChild(figure);
    }

    nodes.forEach((node) => node.remove());
    section.appendChild(grid);
  };

  const loadReport = async () => {
    try {
      if (!reportUrl || !window.marked) {
        throw new Error("Report renderer unavailable.");
      }

      const separator = reportUrl.includes("?") ? "&" : "?";
      const response = await fetch(`${reportUrl}${separator}v=${Date.now()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Report request failed with status ${response.status}.`);
      }

      const markdown = await response.text();
      const parsed = document.createElement("div");
      parsed.innerHTML = window.marked.parse(markdown);
      normaliseUrls(parsed);

      const reportHeading = parsed.querySelector("h1");
      const pageHeading = document.querySelector(".report-title");
      if (reportHeading && pageHeading) {
        pageHeading.textContent = reportHeading.textContent;
      }
      reportHeading?.remove();

      liveReport.replaceChildren(buildSections(parsed));
      enhanceFigures(liveReport);

      const objective = liveReport.querySelector('[data-section="audit-objective"] > p');
      const lede = document.querySelector(".report-lede");
      if (objective && lede) {
        lede.textContent = objective.textContent;
      }
    } catch (error) {
      liveReport.innerHTML = `
        <p class="live-report-error">
          The report could not be loaded here. You can read the canonical report
          <a href="https://github.com/ag-prudenzano/survey-response-quality-audit/blob/main/report.md" target="_blank" rel="noopener noreferrer">on GitHub</a>.
        </p>`;
      console.error(error);
    }
  };

  loadReport();
}
