# AI4G Vite

Многостраничный сайт с упражнениями, техниками и сервисами для личностного развития.
Проект построен на базе **Vite** с модульной архитектурой фронта и серверной поддержкой через PHP.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте браузер по адресу `http://localhost:5173` (порт задан в `vite.config.js`).

запуск php

```bash
F:\web\php\php.exe -S localhost:8000

```

### Доступные команды

| Команда           | Описание                         |
| ----------------- | -------------------------------- |
| `npm run dev`     | Запуск dev-сервера Vite          |
| `npm run build`   | Сборка продакшн-версии в `/dist` |
| `npm run preview` | Предпросмотр сборки              |

---

## Структура проекта

```
ai4g-vite/
├── .github/                   # Workflows GitHub Actions (CI/CD)
├── .well-known/               # SSL- и доменные проверки (например, LetsEncrypt)
├── dist/                      # Продакшн-сборка (результат `npm run build`)
├── node_modules/              # Зависимости npm
├── php/                       # Серверные скрипты для обработки форм (mail, оплаты)
│   ├── mail.php
│   ├── payment.php
│   └── config.php
├── PHPMailer/                 # Библиотека PHPMailer (отправка писем)
│   ├── language/
│   └── src/
├── public/                    # Необрабатываемые статики: favicon, robots.txt, иконки
│   ├── favicon.ico
│   ├── robots.txt
│   └── js/
├── scripts/                   # Служебные и build-скрипты
│   └── vite-plugin-html-include.js   # Плагин для @@include in Vite
├── seo/                       # SEO-файлы и sitemap
│   ├── sitemap.xml
│   └── ...
├── src/                       # Главный каталог исходников
│   ├── data/                  # JSON-данные (например, technics.json)
│   │   └── technics.json
│   ├── img/                   # Картинки и все иллюстрации по подпапкам:
│   │   ├── art-coaching/
│   │   ├── career-advice/
│   │   ├── coaching-session/
│   │   ├── files/
│   │   ├── main/
│   │   ├── partners/
│   │   ├── serf-session/
│   │   ├── technics/
│   │   └── ...
│   ├── pages/                 # JS-логика для страниц (например, technics-page.js)
│   │   ├── technics-page.js
│   │   ├── technic-page.js
│   │   └── ...
│   ├── partials/              # HTML-фрагменты (header, footer, формы, подключение js)
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   ├── js.html
│   │   ├── request-form.html
│   │   └── payment-form.html
│   ├── scripts/               # Крупные JS-модули и инициализация, устаревшие/резервные
│   │   ├── js/                # (Неиспользуемое/архив)
│   │   └── modules/           # Модули по смыслу
│   │       ├── animations/    # Анимации по секциям (fairway, mentors, partners)
│   │       ├── forms/         # Валидация и кнопки форм
│   │       ├── sliders/       # Swiper-инициализация
│   │       ├── ui/            # Меню, scroll-up, show-more и т.д.
│   │       └── utils/         # Вспомогательные утилиты (offset, firefox-fix...)
│   └── styles/                # SCSS-архитектура
│       ├── base/              # Переменные, сброс, миксины
│       ├── components/        # Компоненты (header, footer, card, filter и т.д.)
│       ├── form/              # Формы
│       ├── layout/            # Общие сетки и разметка
│       ├── pages/             # Стили отдельных страниц (technics, patterns, ...)
│       ├── utilities/         # Микроутилитарные классы
│       └── main.scss          # Главный файл для импорта всех SCSS
│   # HTML-страницы (в корне src/)
│   ├── index.html
│   ├── services.html
│   ├── technics.html
│   ├── technics/              # Детальные страницы техник (генерация)
│   ├── patterns.html
│   ├── vozmozhnosti.html
│   ├── mentors.html
│   ├── allegro.html
│   ├── art-coaching.html
│   ├── career-advice.html
│   ├── coaching-session.html
│   ├── serf-session.html
│   ├── personal.html
│   ├── personal-strategy.html
│   ├── oferta.html
│   ├── oplata.html
│   ├── requisites.html
│   ├── 404.html
│   └── ...
├── technics.xlsx              # Таблица с техниками для массового импорта/обновления
├── vite.config.js             # Главный конфиг Vite
├── package.json               # Описания npm-зависимостей и скриптов
└── README.md                  # Этот файл
```

---

## Подробное описание основных папок и файлов

- **src/partials/** — Header, Footer, head, формы, модальные окна, подключение JS. Все фрагменты встраиваются в страницы через @@include.
- **src/pages/** — Логика для страниц с интерактивностью и динамикой (technics, детальные страницы техник).
- **src/data/technics.json** — Данные по техникам, фильтры, справочники.
- **src/img/technics/** — Картинки для техник.
- **src/styles/** — Все слои стилей: базовые (base), компоненты, layout, формы, страницы (pages), утилиты.
- **public/** — Все файлы, которые копируются в production без сборки (favicon, robots.txt, иконки и др.).
- **php/**, **PHPMailer/** — Сервер: backend-обработчики форм, отправка почты, настройка SMTP.
- **seo/** — SEO-файлы, включая sitemap.
- **scripts/** — Кастомные сборочные скрипты, включая vite-plugin-html-include.js.
- **technics.xlsx** — Мастер-таблица техник для редактирования и конвертации в JSON.

## Основные страницы и разделы

- **index.html** — Главная страница (герой, этапы, наставники, отзывы, продукты)
- **technics.html** — Каталог техник (фильтрация, поиск, категории, сортировка)
- **technics/** — Детальные страницы техник с загрузкой по slug
- **patterns.html** — Каталог паттернов поведения
- **vozmozhnosti.html** — Каталог возможностей, фильтры, категории
- **mentors.html** — Наставники
- **allegro.html** — Транскрибатор
- **services.html** — Услуги: коучинг, консультации, стратегия и др.
- **art-coaching.html** — Арт-коучинг
- **coaching-session.html** — Коучинг-сессия
- **career-advice.html** — Карьерная консультация
- **serf-session.html** — SERF-сессия
- **personal.html** — Персональная страница
- **personal-strategy.html** — Персональная стратегия
- **oferta.html** — Договор оферты
- **oplata.html** — Оплата
- **requisites.html** — Реквизиты
- **404.html** — Страница ошибки, fallback

## Стек технологий

- **HTML5**
- **SCSS** — слоистая архитектура (base, components, pages, utils и др.)
- **JavaScript (ES Modules)** — структура по блокам/страницам, динамика и анимации
- **PHP** — серверная часть для обработки форм и e-mail
- **Vite** — быстрый сборщик и dev-сервер, поддержка множества страниц (MPA)
- **Swiper** — слайдеры
- **Fancybox** — модальные окна, галереи
- **PHPMailer** — отправка e-mail с форм

---

## Особенности проекта

- **MPA (Multi-Page Application):**
  Каждая страница — отдельная точка входа. Vite автоматически подключает все `.html`-файлы внутри `src/` и его подпапок,
  кроме директорий `partials/`.

- **SCSS-инфраструктура:**
  Строгое разделение — базовые стили, компоненты, layout, страницы, утилиты.

- **Модульный JS:**
  Выделенные папки по функционалу (animations, forms, sliders, ui, utils).

- **HTML-фрагменты (partials):**
  Включаются в любую страницу через собственный плагин (@@include).

- **PHP / PHPMailer:**
  Для всех форм (почта, оплата).

- **SEO:**
  Отдельная папка с sitemap и robots.txt.

---

## Каталоги техник: фильтрация и детали

- **technics.html** — каталог с фильтрацией, поиском, сортировкой (данные берутся из src/data/technics.json).
- **technics/technic.html?slug=...** — детальная страница техники (данные подгружаются по slug).
- **technics.xlsx** — для массовых обновлений/редактирования техник (конвертация в JSON).
- **Картинки техник** — загружаются в src/img/technics/.

## Развёртывание

### Фронтенд (Vite-сборка)

```bash
npm run build
```

Результат попадает в папку `/dist`. Можно выложить на любой статический хостинг (Nginx, Apache, GitHub Pages, Netlify и т.д.).

### С поддержкой PHP

Выложить на хостинг/сервер с PHP. Файлы `php/*.php` (обработчики форм) будут выполняться на стороне сервера. В `php/`-скриптах используется PHPMailer для отправки писем.

---

## Автоматическое подключение HTML-страниц

В vite.config.js используется функция `collectHtmlInputs()`,
которая рекурсивно сканирует папку `src/`
и автоматически подключает все `.html`-страницы в качестве entry points для `Rollup/Vite`.

Исключаются только директории `partials/`.

Это позволяет:

- не прописывать страницы вручную;
- свободно создавать новые страницы и вложенные разделы;
- поддерживать полноценную MPA-архитектуру.

## Alias

В проекте используется alias:

/@src

Пример:

import data from "/@src/data/technics.json";

Alias указывает на папку src/.

## Папка public/

Все файлы из public/ копируются в dist/
без обработки и хеширования Vite.

Используется для:

favicon
robots.txt
sitemap
внешних JS
статических иконок
.well-known

## Root-директория Vite

Проект использует:
root: "src"
Поэтому все HTML-страницы, стили и клиентские скрипты располагаются внутри src/.
Это упрощает структуру MPA-проекта и отделяет исходники от служебных файлов.

## Production build

После выполнения:
`npm run build`

Vite:

- собирает JS/CSS;
- оптимизирует ассеты;
- добавляет hash к файлам;
- копирует public/;
- сохраняет результат в dist/.

## Архитектурные решения

### Почему MPA вместо SPA

Проект использует Multi-Page Architecture (MPA), потому что:

- страницы имеют независимый SEO;
- проще масштабировать контентные разделы;
- меньше JS на клиенте;
- быстрее initial load;
- проще поддерживать лендинги и продуктовые страницы.

### Почему HTML + Vite вместо React

Проект ориентирован на:

- высокую скорость загрузки;
- SEO;
- минимальный runtime;
- простую генерацию страниц;
- лёгкое масштабирование контента.

## Добавление новой страницы

Создать .html внутри src/
Подключить partials через @@include
Создать SCSS в styles/pages/
При необходимости добавить JS в pages/

Никаких изменений в vite.config.js не требуется —
страница подключится автоматически.

## Динамические страницы техник

- Добавить technics.json по параметру slug (например, "deep-work").

## Контакты

**Автор:** [@viktorygis](https://github.com/viktorygis)

## Ошибки при сборке

```CSS
   @mixin agree-checkbox {
 &::before {
      content: url('../img/check-disabled.svg');
         }
    &:checked {
      content: url('../img/check.svg');
    }
  }
```

Не отображается в dev-сборке, но работает в production. Это связано с особенностями Vite и Rollup. Решение: использовать абсолютный путь:

```CSS
   @mixin agree-checkbox {
 &::before {
      content: url('/@src/img/check-disabled.svg');
         }
    &:checked {
      content: url('/@src/img/check.svg');
    }
  }
```
