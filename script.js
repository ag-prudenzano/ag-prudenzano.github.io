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
        <p class="contact-eyebrow">Let's Connect</p>
        <h2 id="contact-dialog-title">Contact Me</h2>
        <div class="contact-details">
          <a class="contact-row" href="mailto:eroswysen@icloud.com">
            <img class="contact-row-icon" src="assets/contact-email.svg?v=20260729-1" alt="">
            <span class="contact-row-text">eroswysen@icloud.com</span>
          </a>
          <a class="contact-row" href="tel:+447749777539">
            <img class="contact-row-icon" src="assets/contact-mobile.svg?v=20260729-1" alt="">
            <span class="contact-row-text">+44 7749 777 539</span>
          </a>
          <div class="contact-row">
            <img class="contact-row-icon" src="assets/contact-location.svg?v=20260729-1" alt="">
            <span class="contact-row-text">Birmingham, England, United Kingdom</span>
          </div>
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
