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
        const slug = slugify(element.textContent || "section");
        section = document.createElement("section");
        section.className = "live-report-section";
        section.dataset.section = slug;
        section.id = `report-${slug}`;
        element.id = `report-${slug}-heading`;
        section.setAttribute("aria-labelledby", element.id);
        section.appendChild(element);
        fragment.appendChild(section);
      } else if (section) {
        section.appendChild(element);
      }
    });

    return fragment;
  };

  const enhanceProjectSnapshot = (container) => {
    const section = container.querySelector('[data-section="project-snapshot"]');
    if (!section) return;

    const table = section.querySelector(":scope > table");
    const headers = table ? Array.from(table.querySelectorAll("thead th")) : [];
    const values = table ? Array.from(table.querySelectorAll("tbody tr:first-child td")) : [];

    if (table && headers.length && values.length) {
      const snapshot = document.createElement("dl");
      snapshot.className = "live-report-snapshot";

      headers.forEach((header, index) => {
        const value = values[index];
        if (!value) return;

        const item = document.createElement("div");
        item.className = "live-report-snapshot-item";

        const term = document.createElement("dt");
        term.textContent = header.textContent.trim();

        const description = document.createElement("dd");
        description.innerHTML = value.innerHTML;

        item.append(term, description);
        snapshot.appendChild(item);
      });

      table.replaceWith(snapshot);
    }

    const skillsParagraph = Array.from(section.querySelectorAll(":scope > p")).find((paragraph) => {
      const label = paragraph.querySelector(":scope > strong");
      return label?.textContent?.trim().toLowerCase().startsWith("skills demonstrated");
    });

    if (!skillsParagraph) return;

    const labelNode = skillsParagraph.querySelector(":scope > strong");
    const labelText = labelNode?.textContent?.replace(/:\s*$/, "").trim() || "Skills Demonstrated";
    const skillText = skillsParagraph.textContent
      .replace(labelNode?.textContent || "", "")
      .replace(/^\s*:\s*/, "")
      .trim();
    const skills = skillText
      .split("·")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!skills.length) return;

    const block = document.createElement("div");
    block.className = "live-report-skill-block";

    const label = document.createElement("p");
    label.className = "live-report-skill-label";
    label.textContent = labelText;

    const list = document.createElement("ul");
    list.className = "live-report-skill-list";
    list.setAttribute("aria-label", labelText);

    skills.forEach((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      list.appendChild(item);
    });

    block.append(label, list);
    skillsParagraph.replaceWith(block);
  };

  const enhanceSectionNavigation = (container) => {
    const snapshot = container.querySelector('[data-section="project-snapshot"]');
    if (!snapshot) return;

    const sections = Array.from(container.querySelectorAll(":scope > .live-report-section")).filter(
      (section) => section.dataset.section !== "project-snapshot"
    );
    if (!sections.length) return;

    const nav = document.createElement("nav");
    nav.className = "live-report-index";
    nav.setAttribute("aria-label", "Report sections");

    const label = document.createElement("p");
    label.className = "live-report-index-label";
    label.textContent = "On This Page";

    const list = document.createElement("ul");
    list.className = "live-report-index-list";

    sections.forEach((section) => {
      const heading = section.querySelector(":scope > h2");
      if (!heading || !section.id) return;

      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
    });

    nav.append(label, list);
    snapshot.appendChild(nav);
  };

  const enhanceQualityChecks = (container) => {
    const section = container.querySelector('[data-section="quality-checks"]');
    const list = section?.querySelector(":scope > ol");
    if (!section || !list) return;

    list.classList.add("live-report-checks");
    list.setAttribute("aria-label", "Eight respondent-level quality checks");

    Array.from(list.children).forEach((item) => {
      const titleNode = item.querySelector(":scope > strong");
      const title = titleNode?.textContent?.trim() || "Quality Check";
      if (titleNode) titleNode.remove();

      const description = item.textContent
        .replace(/^\s*[—–-]\s*/, "")
        .trim();

      item.classList.add("live-report-check");

      const heading = document.createElement("h3");
      heading.textContent = title;

      const paragraph = document.createElement("p");
      paragraph.textContent = description;

      item.replaceChildren(heading, paragraph);
    });
  };

  const enhanceFindings = (container) => {
    const section = container.querySelector('[data-section="findings"]');
    if (!section) return;

    const tables = Array.from(section.querySelectorAll(":scope > table"));
    const summaryTable = tables.find((table) => {
      const headers = Array.from(table.querySelectorAll("thead th")).map((header) =>
        header.textContent.trim().toLowerCase()
      );
      return headers.includes("flagged") && headers.includes("manual review") && headers.includes("exclusion");
    });

    if (!summaryTable) return;

    const headers = Array.from(summaryTable.querySelectorAll("thead th"));
    const values = Array.from(summaryTable.querySelectorAll("tbody tr:first-child td"));
    if (!headers.length || !values.length) return;

    const metrics = document.createElement("dl");
    metrics.className = "live-report-metrics";
    metrics.setAttribute("aria-label", "Key audit findings");

    headers.forEach((header, index) => {
      const value = values[index];
      if (!value) return;

      const item = document.createElement("div");
      item.className = "live-report-metric";

      const term = document.createElement("dt");
      term.textContent = header.textContent.trim();

      const description = document.createElement("dd");
      description.innerHTML = value.innerHTML;

      item.append(term, description);
      metrics.appendChild(item);
    });

    summaryTable.replaceWith(metrics);
  };

  const enhanceTables = (container) => {
    container.querySelectorAll("table").forEach((table) => {
      if (table.parentElement?.classList.contains("live-report-table-wrap")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "live-report-table-wrap";
      table.before(wrapper);
      wrapper.appendChild(table);
    });
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
        const captionId = `figure-${slugify(node.textContent || "chart")}-caption`;
        caption.id = captionId;
        caption.innerHTML = captionParagraph.innerHTML;
        if (image) image.setAttribute("aria-describedby", captionId);
        figure.appendChild(caption);
        captionParagraph.remove();
        index += 1;
      }

      grid.appendChild(figure);
    }

    nodes.forEach((node) => node.remove());
    section.appendChild(grid);
  };

  const enhanceProjectFiles = (container) => {
    const section = container.querySelector('[data-section="project-files"]');
    const list = section?.querySelector(":scope > ul");
    if (!section || !list) return;

    list.classList.add("live-report-file-list");

    Array.from(list.children).forEach((item) => {
      const sourceLink = item.querySelector("a[href]");
      if (!sourceLink) return;

      const filename = sourceLink.textContent.trim();
      const fullText = item.textContent.trim();
      const description = fullText
        .slice(filename.length)
        .replace(/^\s*[—–-]\s*/, "")
        .replace(/\.$/, "")
        .trim();

      const row = document.createElement("a");
      row.href = sourceLink.href;
      row.target = sourceLink.target || "_blank";
      row.rel = sourceLink.rel || "noopener noreferrer";

      const label = document.createElement("span");
      label.textContent = description || filename;

      const file = document.createElement("span");
      file.textContent = `${filename} ↗`;

      row.append(label, file);
      item.replaceChildren(row);
    });
  };

  const loadReport = async () => {
    liveReport.setAttribute("aria-busy", "true");

    try {
      if (!reportUrl || !window.marked) {
        throw new Error("Report renderer unavailable.");
      }

      const response = await fetch(reportUrl, { cache: "no-cache" });

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
      enhanceProjectSnapshot(liveReport);
      enhanceSectionNavigation(liveReport);
      enhanceQualityChecks(liveReport);
      enhanceFindings(liveReport);
      enhanceTables(liveReport);
      enhanceFigures(liveReport);
      enhanceProjectFiles(liveReport);
    } catch (error) {
      liveReport.innerHTML = `
        <p class="live-report-error" role="status">
          The report could not be loaded here. You can read the canonical report
          <a href="https://github.com/ag-prudenzano/survey-response-quality-audit/blob/main/report.md" target="_blank" rel="noopener noreferrer">on GitHub</a>.
        </p>`;
      console.error(error);
    } finally {
      liveReport.setAttribute("aria-busy", "false");
    }
  };

  loadReport();
}
