const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const contactButton = document.querySelector(".contact-button");

if (contactButton) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <dialog class="contact-dialog" aria-labelledby="contact-dialog-title">
        <button class="contact-close" type="button" aria-label="Close contact panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
        <p class="contact-eyebrow">Contact</p>
        <h2 id="contact-dialog-title">Contact Me</h2>
        <div class="contact-details">
          <a href="mailto:eroswysen@icloud.com">eroswysen@icloud.com</a>
          <a href="tel:+447749777539">+44 7749 777 539</a>
          <span>Birmingham, England, United Kingdom</span>
        </div>
      </dialog>
    `
  );

  const contactDialog = document.querySelector(".contact-dialog");
  const closeButton = contactDialog.querySelector(".contact-close");

  contactButton.addEventListener("click", () => contactDialog.showModal());
  closeButton.addEventListener("click", () => contactDialog.close());
  contactDialog.addEventListener("click", (event) => {
    if (event.target === contactDialog) contactDialog.close();
  });
}
