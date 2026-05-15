console.log("technic-page loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const contentContainer = document.getElementById("technic-page");

  if (!contentContainer) return;

  // Получаем slug из URL
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    renderError("Техника не найдена");
    return;
  }

  try {
    const response = await fetch("data/technics.json");

    if (!response.ok) {
      throw new Error(`Ошибка загрузки JSON: ${response.status}`);
    }

    const technics = await response.json();

    // Ищем технику по slug
    const technic = technics.find(item => item.slug === slug);

    if (!technic) {
      renderError("Техника не найдена");
      return;
    }

    renderTechnic(technic);

  } catch (error) {
    console.error(error);
    renderError("Ошибка загрузки страницы");
  }

  function renderTechnic(item) {

    document.title = item.title;

    contentContainer.innerHTML = `
      <section class="technics" id="top">

        <div class="technics__container">

          <ul class="technics__bread-crumbs">
            <li>
              <a href="../index.html">Главная</a>
            </li>

            <li>
              <a href="../technics.html">Техники</a>
            </li>

            <li>
              ${item.title}
            </li>
          </ul>

          <div class="technics__body">

            <div class="technics__top">

              <h1 class="technics__title title">
                ${item.title}
              </h1>

              <div class="technics__img">
                <img src="${item.image}" alt="${item.title}">
              </div>

            </div>

            <!-- Описание -->
            <div>
              <h2 class="technics__label label">
                Описание:
              </h2>

              <p>
                ${item.description}
              </p>
            </div>

            <!-- Категория -->
            <div>
              <h2 class="technics__label label">
                Категория техники:
              </h2>

              <p>
                ${item.category}
              </p>
            </div>

            <!-- Время -->
            <div>
              <h2 class="technics__label label">
                Время:
              </h2>

              <p>
                ${item.time} минут
              </p>
            </div>

            <!-- Контент -->
            <div>

              <h2 class="technics__label label">
                Техника:
              </h2>

              <div class="technics__content">
                ${item.content}
              </div>

            </div>

            <!-- Ссылки -->
            <div class="technics__links">

              <a href="/technics.html?category=${item.tag}">
                #${item.category}
              </a>

            </div>

          </div>

        </div>

      </section>
    `;
  }

  function renderError(message) {
    contentContainer.innerHTML = `
      <section class="technic-error">

        <div class="technics__container">

          <h1>
            ${message}
          </h1>

          <a href="/technics.html">
            ← Вернуться к техникам
          </a>

        </div>

      </section>
    `;
  }
});