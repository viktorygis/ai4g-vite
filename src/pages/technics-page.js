// Файл: src/pages/technics-page.js

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ЭЛЕМЕНТЫ
  // =========================

  const sortDropdown = document.querySelector(".sort__dropdown");

  if (!sortDropdown) {
    console.warn("sort__dropdown не найден");
    return;
  }

  const sortSelected = sortDropdown.querySelector(".sort__selected");
  const sortSelectedArrow = sortDropdown.querySelector(".sort__selected-arrow");
  const sortOptions = sortDropdown.querySelector(".sort__options");
  const sortOptionElements = sortDropdown.querySelectorAll(".sort__option");

  const cardsContainer = document.querySelector(".tekhniki__body");

  const noCardsPlaceholder = document.getElementById("no-cards-placeholder");

  // =========================
  // СОСТОЯНИЕ
  // =========================

  let activeCategory = null;
  let activeTimeRange = null;
  let activeSortOrder = "default";

  // =========================
  // URL PARAMS
  // =========================

  const urlParams = new URLSearchParams(window.location.search);

  activeCategory = urlParams.get("category") || null;
  activeTimeRange = urlParams.get("time") || null;

  // =========================
  // INIT
  // =========================

  loadJsonFile();

  // =========================
  // SORT DROPDOWN
  // =========================

  sortSelected.addEventListener("click", () => {
    sortOptions.style.display = sortOptions.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (event) => {
    if (!sortDropdown.contains(event.target)) {
      sortOptions.style.display = "none";
    }
  });

  sortOptionElements.forEach((option) => {
    option.addEventListener("click", () => {
      updateActiveClass(option, sortOptionElements);

      activeSortOrder = option.dataset.value;

      sortOptions.style.display = "none";

      sortCards(activeSortOrder);
    });
  });

  // =========================
  // FILTER BUTTONS
  // =========================

  document.querySelectorAll(".filter__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleFilter(btn.dataset.category, btn.dataset.time);

      applyFiltersAndSorting();
    });
  });

  // =========================
  // RESET BUTTON
  // =========================

  const resetFilterButton = document.querySelector('.reset-filter[data-reset="all"]');

  if (resetFilterButton) {
    resetFilterButton.addEventListener("click", () => {
      activeCategory = null;
      activeTimeRange = null;
      activeSortOrder = "default";

      filterCards(activeCategory, activeTimeRange);

      updateResetButtonVisibility();

      const defaultOption = sortDropdown.querySelector('.sort__option[data-value="default"]');

      if (defaultOption) {
        updateActiveClass(defaultOption, sortOptionElements);

        sortCards(activeSortOrder);
      }
    });
  }

  // =========================
  // FUNCTIONS
  // =========================

  function updateActiveClass(element, elements) {
    elements.forEach((opt) => opt.classList.remove("active"));

    element.classList.add("active");

    updateSortSelected(element);
  }

  function updateSortSelected(option) {
    const selectedSpan = sortSelected.querySelector("span");

    if (selectedSpan) {
      selectedSpan.textContent = option.querySelector("span").textContent;
    }

    const selectedValue = option.dataset.value;

    sortSelectedArrow.style.display = selectedValue !== "default" ? "inline-block" : "none";

    sortSelectedArrow.classList.toggle("sort__option_02", selectedValue === "desc");
  }

  function toggleFilter(category, timeRange) {
    if (category !== "all") {
      activeCategory = activeCategory === category ? null : category;
    }

    if (timeRange !== "all") {
      activeTimeRange = activeTimeRange === timeRange ? null : timeRange;
    }
  }

  function applyFiltersAndSorting() {
    filterCards(activeCategory, activeTimeRange);

    sortCards(activeSortOrder);

    updateResetButtonVisibility();

    const activeOption = sortDropdown.querySelector(`.sort__option[data-value="${activeSortOrder}"]`);

    if (activeOption) {
      updateSortSelected(activeOption);
    }
  }

  // =========================
  // FILTER
  // =========================

  function filterCards(category, timeRange) {
    const cards = document.querySelectorAll(".card");

    let hasVisibleCards = false;

    document.querySelectorAll(".filter__btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (category) {
      const categoryButton = document.querySelector(`.filter__btn[data-category="${category}"]`);

      if (categoryButton) {
        categoryButton.classList.add("active");
      }
    }

    if (timeRange) {
      const timeButton = document.querySelector(`.filter__btn[data-time="${timeRange}"]`);

      if (timeButton) {
        timeButton.classList.add("active");
      }
    }

    cards.forEach((card) => {
      const cardCategory = card.dataset.tag;
      const cardTime = card.dataset.time;

      const categoryMatch = !category || cardCategory === category;

      const timeMatch = !timeRange || cardTime === timeRange;

      if (categoryMatch && timeMatch) {
        card.classList.remove("hidden");

        hasVisibleCards = true;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noCardsPlaceholder) {
      noCardsPlaceholder.style.display = hasVisibleCards ? "none" : "block";
    }

    updateURL(category, timeRange);
  }

  // =========================
  // SORT
  // =========================

  function sortCards(order) {
    const cards = Array.from(cardsContainer.querySelectorAll(".card"));

    if (order === "default") {
      cards.sort((a, b) => {
        return parseInt(a.dataset.index) - parseInt(b.dataset.index);
      });
    } else {
      cards.sort((a, b) => {
        const titleA = a.querySelector(".card__subtitle").textContent.trim().toLowerCase();

        const titleB = b.querySelector(".card__subtitle").textContent.trim().toLowerCase();

        return order === "asc" ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      });
    }

    cards.forEach((card) => {
      cardsContainer.appendChild(card);
    });
  }

  // =========================
  // RESET BUTTON VISIBILITY
  // =========================

  function updateResetButtonVisibility() {
    const resetButton = document.querySelector('.reset-filter[data-reset="all"]');

    if (!resetButton) return;

    resetButton.style.display = activeCategory || activeTimeRange ? "inline-block" : "none";
  }

  // =========================
  // URL UPDATE
  // =========================

  function updateURL(category, timeRange) {
    const params = new URLSearchParams();

    if (category) {
      params.set("category", category);
    }

    if (timeRange) {
      params.set("time", timeRange);
    }

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;

    history.replaceState(null, "", newUrl);
  }

  // =========================
  // LOAD JSON
  // =========================

  function loadJsonFile() {
    cardsContainer.innerHTML = '<div class="loading">Загрузка...</div>';

    fetch("/data/technics.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка загрузки JSON: ${response.status}`);
        }

        return response.json();
      })

      .then((data) => {
        cardsContainer.innerHTML = "";

        if (!data.length) {
          cardsContainer.innerHTML = "<p>Нет данных</p>";

          return;
        }

        data.forEach((item, index) => {
          const card = document.createElement("div");

          card.className = "card";

          card.dataset.tag = item.tag;

          card.dataset.time = getTimeRange(item.time);

          card.dataset.index = index;

          card.innerHTML = `
            <div class="card__body">

              <div class="card__top">

                <div class="card__img">
                  <img src="${item.image}" alt="${item.subtitle}">
                </div>

                <h3 class="card__subtitle">
                  ${item.subtitle}
                </h3>

                <div class="card__description">
                  ${item.description}
                </div>

                <div class="card__category ${item.tag}">
                  ${item.category}
                </div>

              </div>

              <div class="card__time">
                ${item.time} мин
              </div>

              <a href="technic.html?slug=${item.slug}" class="card__link">
                Подробнее
              </a>

            </div>
          `;

          cardsContainer.appendChild(card);
        });

        // ВАЖНО:
        // фильтрация и сортировка только ПОСЛЕ загрузки карточек

        filterCards(activeCategory, activeTimeRange);

        sortCards(activeSortOrder);

        updateResetButtonVisibility();
      })

      .catch((error) => {
        console.error("Ошибка загрузки JSON:", error);

        cardsContainer.innerHTML = '<div class="error">Ошибка загрузки данных</div>';
      });
  }

  // =========================
  // TIME RANGE
  // =========================

  function getTimeRange(time) {
    const minutes = parseInt(time);

    if (minutes < 10) {
      return "lt10";
    }

    if (minutes >= 10 && minutes < 30) {
      return "10-30";
    }

    if (minutes >= 30 && minutes < 60) {
      return "30-60";
    }

    return "all";
  }
});
