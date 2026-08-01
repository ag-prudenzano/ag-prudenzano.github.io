const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
if (header) {
  header.style.maxWidth = "none";
  header.style.margin = "0";
  header.style.borderBottom = "0";
}
