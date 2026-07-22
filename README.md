Файл: README.md

# AI4G Vite

Многостраничный сайт AI4G с упражнениями, техниками и сервисами для личностного развития.

Проект построен на **Vite**:

- сборка HTML/CSS/JS;
- генерация страниц техник из JSON;
- поддержка PHP-обработчиков форм.

---

## Установка проекта

После скачивания проекта выполнить:

```bash
npm install
```

---

## Запуск разработки

### 1. Генерация страниц техник

Перед первым запуском и после изменения файла:

```
src/data/technics.json
```

выполнить:

```bash
npm run generate
```

Команда создаёт HTML-страницы техник из шаблона.

### 2. Запуск Vite

```bash
npm run dev
```

После запуска открыть:

```
http://localhost:5173
```

---

## Запуск PHP

PHP нужен для работы серверных обработчиков (например, форм).

Запустить в отдельном окне терминала:

```bash
F:\web\php\php.exe -S localhost:8000
```

---

## Основные команды

| Команда            | Назначение                          |
| ------------------ | ----------------------------------- |
| `npm install`      | Установка зависимостей проекта      |
| `npm run generate` | Генерация страниц техник из JSON    |
| `npm run dev`      | Запуск проекта в режиме разработки  |
| `npm run build`    | Создание production-сборки          |
| `npm run preview`  | Просмотр production-сборки локально |

---

## Подготовка к публикации

Перед переносом сайта на сервер:

```bash
npm run generate
npm run build
```

После выполнения сборки создаётся папка:

```
dist/
```

На сервер переносится содержимое папки `dist`.

---

## Production build

Команда:

```bash
npm run build
```

выполняет:

- сборку HTML/CSS/JS;
- оптимизацию файлов;
- добавление hash к ресурсам;
- копирование файлов из `public/`;
- создание готовой папки `dist/`.

---

## Развёртывание с PHP

Если используются формы:

- сервер должен поддерживать PHP;
- папка `php/` должна быть загружена на сервер;
- обработчики форм выполняются на стороне сервера.

Для отправки писем используется **PHPMailer**.

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
│   ├── js/
│   │   ├── manifest.json      - манифест для PWA
│   │   └── sw.js              - service worker для PWA
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
├── scripts/                   # Служебные и build-скрипты
│   ├── generate-technics.js   # Скрипт генерации детальных страниц техник из technics.json
│   └── vite-plugin-html-include.js   # Плагин для @@include in Vite
│   │
├── seo/                       # SEO-файлы и sitemap - для поисковых систем
│   ├── .htaccess              - Настройка редиректов и правил для Apache
│   ├── robots.txt             - Настройка индексации для поисковых систем
│   └── sitemap.xml            - Sitemap для поисковых систем
│   │
├── src/                       # Главный каталог исходников
│   ├── data/                  # JSON-данные (например, technics.json)
│   │   ├── patterns.json      - JSON-данные по паттернам
│   │   ├── technics.json      - JSON-данные по техникам
│   │   └── vozmozhnosti.json  - JSON-данные по возможностям
│   │
│   ├── pages/                 # JS-логика для страниц (например, technics-page.js)
│   │   ├── career-advice-page.js
│   │   ├── coaching-session-page.js
│   │   ├── patterns-page.js
│   │   ├── personal-strategy-page.js
│   │   ├── serf-session-page.js
│   │   ├── session-animations.js
│   │   ├── technic-page.js
│   │   ├── technics-page.js
│   │   ├── transcribator-page.js
│   │   └── vozmozhnosti-page.js
│   │
│   ├── partials/                     # HTML-фрагменты (header, footer, формы, подключение js)
│   │   ├── head.html                 # head, meta, title, description
│   │   ├── header.html               # header, меню, навигация
│   │   ├── footer.html               # footer, контакты, соцсети
│   │   ├── js.html                   # подключение JS-файлов
│   │   ├── modal-swiper.html         # модальные окна с галереями
│   │   ├── request-form.html         # форма запроса на услугу
│   │   └── payment-form.html         # форма оплаты
│   │
│   ├── scripts/                      # Крупные JS-модули и инициализация, устаревшие/резервные
│   │   ├── js/                       # (Неиспользуемое/архив)
│   │   │   ├── 404.js                # Логика страницы 404
│   │   │   ├── offline.html           # Логика offline-страницы
│   │   │   └── products.js            # Логика страницы продуктов
│   │   │   │
│   │   └── modules/                   # Модули по смыслу
│   │   │   ├── animations/            # Анимации по секциям (fairway, mentors, partners)
│   │   │   │   ├── choice-anim.js     # Анимация choice
│   │   │   │   ├── fairway-anim.js    # Анимация fairway
│   │   │   │   ├── mentors-anim.js    # Анимация mentors
│   │   │   │   └── partners-anim.js   # Анимация
│   │   │   │
│   │   │   ├── forms/                 # Валидация и кнопки форм
│   │   │   │   ├── btn-validation.js  # Валидация кнопок форм
│   │   │   │   ├── form-validation.js # Валидация форм
│   │   │   │   └── payment-modal.js   # Модальное окно оплаты
│   │   │   │
│   │   │   ├── sliders/               # Swiper-инициализация
│   │   │   │   └── init-swiper.js     # Инициализация слайдеров
│   │   │   │
│   │   │   ├── ui/                    # Меню, scroll-up, show-more и т.д.
│   │   │   │   ├── cut-text.js        # Сокращение текста с "читать далее"
│   │   │   │   ├── menu.js            # Логика меню
│   │   │   │   ├── scroll-up.js       # Кнопка "scroll-up"
│   │   │   │   └── show-more.js       # Кнопка "show-more"
│   │   │   │
│   │   │   ├── utils/                 # Вспомогательные утилиты
│   │   │   │   └── firefox-fix.js     # Исправление бага Firefox с position: sticky
│   │   │   ├── init-animations.js     # Инициализация анимаций по секциям
│   │   │   └── offset.js              # Вычисление offsetTop для якорей
│   │   └──main.js                     # Главный файл, который импортирует все модули и запускает их
│   └── styles/                        # SCSS-архитектура
│       ├── base/                      # Переменные, сброс, миксины
│       ├── components/                # Компоненты (header, footer, card, filter и т.д.)
│       ├── form/                      # Формы
│       ├── layout/                    # Общие сетки и разметка
│       ├── pages/                     # Стили отдельных страниц (technics, patterns, ...)
│       ├── utilities/                 # Микроутилитарные классы
│       └── main.scss                  # Главный файл для импорта всех SCSS
│   └── technics/                      # Детальные страницы техник (генерация)
│   └── templates/                     # Шаблоны для генерации страниц техник (technic-template.html)
│       └── technic-template.html      # Шаблон
│   # HTML-страницы (в корне src/)
│   ├── 404.html
│   ├── agreement.html
│   ├── allegro.html
│   ├── art-coaching.html
│   ├── career-advice.html
│   ├── coaching-session.html
│   ├── index.html
│   ├── mentors.html
│   ├── oferta.html
│   ├── oplata.html
│   ├── patterns.html
│   ├── personal-strategy.html
│   ├── personal.html
│   ├── requisites.html
│   ├── serf-session.html
│   ├── services.html
│   ├── technic.html        # Детальная страница техники (динамическая, slug-based) - нужна ли?
│   ├── technics.html
│   ├── vozmozhnosti.html
├── .gitignore                      # Файлы и папки, игнорируемые Git
├── package-lock.json               # Автоматически генерируемый файл с точными версиями npm-зависимостей
├── package.json                    # Описания npm-зависимостей и скриптов
├── README.md                       # Этот файл
├── technics.xlsx                   # Таблица с техниками для массового импорта/обновления
├── upload.php                      # Скрипт для загрузки файлов на сервер (например, картинок техник)
└── vite.config.js                  # Главный конфиг Vite

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
