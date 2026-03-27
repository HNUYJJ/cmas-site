const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearTargets = document.querySelectorAll("[data-year]");
const toggleButton = document.querySelector("#lang-toggle");
const metaDescription = document.querySelector("#meta-description");
const linkNodes = Array.from(document.querySelectorAll("[data-base-href]"));
const body = document.body;

for (const node of yearTargets) {
  node.textContent = String(new Date().getFullYear());
}

function languageFromUrl() {
  return new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "zh";
}

function setLanguage(lang, options = {}) {
  const isEnglish = lang === "en";
  document.documentElement.dataset.lang = isEnglish ? "en" : "zh";
  document.documentElement.lang = isEnglish ? "en" : "zh-CN";
  body.dataset.lang = isEnglish ? "en" : "zh";
  document.title = isEnglish ? body.dataset.titleEn : body.dataset.titleZh;

  if (metaDescription) {
    metaDescription.setAttribute("content", isEnglish ? body.dataset.descEn : body.dataset.descZh);
  }

  for (const node of linkNodes) {
    const baseHref = node.dataset.baseHref;
    node.setAttribute("href", isEnglish ? `${baseHref}?lang=en` : baseHref);
  }

  if (toggleButton) {
    toggleButton.setAttribute(
      "aria-label",
      isEnglish ? toggleButton.dataset.labelEn : toggleButton.dataset.labelZh
    );
  }

  if (options.updateUrl) {
    const url = new URL(window.location.href);
    if (isEnglish) {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState(null, "", url);
  }
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

setLanguage(languageFromUrl());

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const current = document.documentElement.dataset.lang === "en" ? "en" : "zh";
    setLanguage(current === "en" ? "zh" : "en", { updateUrl: true });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  for (const item of revealItems) {
    observer.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("is-visible");
  }
}
