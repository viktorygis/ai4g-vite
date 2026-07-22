// src/pages/patterns-page.js
import Swiper from "swiper";
import "swiper/css";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import patternsData from "../data/patterns.json";
Swiper.use([Navigation, FreeMode, Mousewheel]);

document.addEventListener("DOMContentLoaded", async () => {
  const filtersScroll = document.getElementById("filters-scroll");
  const patternsContainer = document.getElementById("patterns-container");

  if (!filtersScroll || !patternsContainer) {
    console.warn("Не найдены контейнеры filters-scroll или patterns-container");
    return;
  }

  patternsContainer.innerHTML = '<div class="patterns__loading">Загрузка…</div>';

  try {
    renderPage(patternsData);
  } catch (err) {
    patternsContainer.innerHTML = '<div class="patterns__error">Не удалось загрузить данные</div>';
    console.error("Ошибка загрузки patterns.json:", err);
  }

  function renderPage(patterns) {
    patternsContainer.innerHTML = "";

    const chipsFragment = document.createDocumentFragment();
    const sectionsFragment = document.createDocumentFragment();

    patterns.forEach((cat) => {
      const section = buildPatternSection(cat);
      sectionsFragment.appendChild(section);

      const chip = document.createElement("a");
      chip.className = "patterns__filter-chip swiper-slide";
      chip.href = `#patterns-${cat.id}`;
      chip.textContent = cat.title;
      chip.setAttribute("aria-label", `Перейти к паттернам ${cat.title}`);
      chipsFragment.appendChild(chip);
    });

    filtersScroll.appendChild(chipsFragment);
    patternsContainer.appendChild(sectionsFragment);

    initFilterSwiper();
    observeActiveCategory();
    enhanceAnchorScrolling();
  }

  function initFilterSwiper() {
    new Swiper(".patterns__filters", {
      modules: [FreeMode, Navigation, Mousewheel],
      slidesPerView: "auto",
      spaceBetween: 12,
      freeMode: {
        enabled: true,
        momentum: true,
        sticky: false,
      },
      loop: false,
      centeredSlides: false,
      grabCursor: true,
      mousewheel: {
        forceToAxis: true,
        sensitivity: 0.5,
      },
      navigation: {
        nextEl: ".patterns__filters .patterns__scroll-btn--right",
        prevEl: ".patterns__filters .patterns__scroll-btn--left",
      },
      breakpoints: {
        768: {
          spaceBetween: 10,
        },
      },
    });
  }

  // Функция для создания секции паттернов
  function buildPatternSection(cat) {
    const section = document.createElement("div");
    section.className = "patterns__section";
    section.setAttribute("aria-labelledby", `pattern-title-${cat.id}`);

    // Якорь для правильного скролла с учётом sticky-шапки (если требуется)
    const anchor = document.createElement("div");
    anchor.id = `patterns-${cat.id}`;
    anchor.className = "patterns__id";

    // Верхняя часть с иконкой и текстом
    const head = document.createElement("div");
    head.className = `patterns__head patterns__head_${cat.id}`;

    const icon = document.createElement("img");
    icon.src = `${import.meta.env.BASE_URL}${cat.icon}`;
    icon.alt = "";
    head.appendChild(icon);

    const subtitle = document.createElement("h2");
    subtitle.className = "patterns__subtitle subtitle";
    subtitle.id = `pattern-title-${cat.id}`;
    subtitle.textContent = cat.subtitle;
    head.appendChild(subtitle);

    const description = document.createElement("p");
    description.className = "patterns__head-text";
    description.textContent = cat.description;
    head.appendChild(description);

    // Контейнер с сеткой паттернов
    const content = document.createElement("div");
    content.className = `patterns__content patterns__content_${cat.id}`;

    const itemsHTML = cat.items
      .map(
        (item) => `
      <div class="patterns__item">
        <img src="${import.meta.env.BASE_URL}${item.img}" alt="${item.name}" loading="lazy" />
        <h3 class="patterns__name">${item.name}</h3>
        <div class="patterns__description">${item.desc}</div>
      </div>
    `,
      )
      .join("");

    content.innerHTML = itemsHTML;

    section.appendChild(anchor);
    section.appendChild(head);
    section.appendChild(content);
    return section;
  }

  // Функция для наблюдения за активной категорией и подсветки соответствующего чипа
  function observeActiveCategory() {
    const sections = document.querySelectorAll(".patterns__section");
    const allChips = document.querySelectorAll(".patterns__filter-chip");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Находим id якоря, соответствующий этой секции
            const anchor = entry.target.querySelector(".patterns__id");
            if (!anchor) return;
            const id = anchor.id; // например, "patterns-01"

            allChips.forEach((chip) => {
              chip.classList.remove("active");
              chip.removeAttribute("aria-current");
            });

            const targetHref = `#${id}`;
            const targetChip = Array.from(allChips).find((chip) => chip.getAttribute("href") === targetHref && !chip.classList.contains("swiper-slide-duplicate"));

            if (targetChip) {
              targetChip.classList.add("active");
              targetChip.setAttribute("aria-current", "true");
            }
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Функция для плавного скролла к секции при клике на чип
  function enhanceAnchorScrolling() {
    document.querySelectorAll(".patterns__filter-chip").forEach((chip) => {
      chip.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      });
    });
  }
})();
