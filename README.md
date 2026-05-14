# AI4G Vite

Многостраничный сайт с упражнениями и техниками.
Технологии: **HTML · PHP · SCSS · JavaScript · Vite**.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте браузер по адресу `http://localhost:5173` (порт задан в `vite.config.js`).

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
├── src/                          # Исходники (root для Vite)
│   └── img/                      # Изображения
│   ├── partials/                 # HTML-фрагменты (подключаются через плагин)
│   │   ├── footer.html           # Футер (общий для всех страниц)
│   │   ├── head.html             # Секция <head> (метатеги, стили, шрифты)
│   │   ├── header.html           # Хедер (общий для всех страниц)
│   │   ├── js.html               # Скрипты
│   │   ├── popup.html            # Всплывающее окно (замена на форму записи?)
│   │   └── payment-form.html     # Форма оплаты
│   ├── scripts/                  # JavaScript-модули
│   │   ├── js/                   # Дополнительные скрипты - не используются
│   │   ├── modules/              # Отдельные модули
│   │   │   ├─btn-validation.js   # Валидация кнопки "Записаться" (проверка чекбокса)
│   │   │   ├─choice-anim.js      # Анимация для блока "Ai4G выбирают"
│   │   │   ├─cut-text.js         # Обрезка текста в карточках техник  technics.html
│   │   │   ├─fairway-anim.js     # Анимация для блока  "fairway" фарватер Ai4G
│   │   │   ├─firefox-fix.js      # Исправление для Firefox (плавная прокрутка и др.)
│   │   │   ├─form-validation.js  # Валидация форм modal-thanks и modal-request
│   │   │   ├─init-animations.js  # Инициализация анимаций при скролле
│   │   │   ├─mentors-anim.js     # Анимация для блока "Менторы" на главной странице
│   │   │   ├─menu.js             # Скрипт для мобильного меню
│   │   │   ├─offset.js           # Модуль для получения координат элемента




относительно документа
│   │   │   ├─partners-anim.js    # Анимация для блока "Наши партнёры"
│   │   │   ├─scroll-up.js        # Плавная прокрутка к началу страницы (кнопка "Наверх")
│   │   │   └─show-more.js        # Логика для кнопки "4G плоскости подробно" на главной странице
│   │   └── main.js               # Точка входа(инициализация из файла partials/js.html)
│   ├── styles/                 # SCSS-стили
│   │   ├── base/               # Переменные, reset, миксины, глобальные стили
│   │   ├── components/         # Компоненты (header, footer, партнёры и др.)
│   │   ├── form/               # Стили форм
│   │   ├── layout/             # Сетка и структура страниц
│   │   ├── pages/              # Стили отдельных страниц
│   │   ├── utilities/          # Утилитарные классы
│   │   └── main.scss           # Главный файл, импортирует всё остальное
│   ├── index.html              # Главная страница
│   ├── services.html           # Услуги
│   ├── technics.html           # Техники (список)
│   ├── technics/               # Страницы отдельных техник
│   ├── patterns.html           # Паттерны
│   ├── personal.html           # Персональная страница
│   ├── personal-strategy.html  # Персональная стратегия
│   ├── allegro.html            # Allegro
│   ├── art-coaching.html       # Арт-коучинг
│   ├── career-advice.html      # Карьерный совет
│   ├── coaching-session.html   # Коучинг-сессия
│   ├── serf-session.html       # SERF-сессия
│   ├── mentors.html            # Менторы
│   ├── vozmozhnosti.html       # Возможности
│   ├── agreement.html          # Согласие
│   ├── oferta.html             # Оферта
│   ├── oplata.html             # Оплата
│   ├── requisites.html         # Реквизиты
│   ├── 404.html                # Страница ошибки
├── scripts/
│   └── vite-plugin-html-include.js  # Кастомный Vite-плагин для @@include
├── php/                        # PHP-скрипты (обработка форм и др.)
├── phpmailer/                  # PHPMailer (отправка почты)
├── PHPMailer/                  # PHPMailer (библиотека)
├── seo/                        # SEO-файлы
├── public/                     # Статика, копируется в корень dist без обработки
├── vite.config.js              # Конфигурация Vite (MPA, порт 5173)
├── package.json
└── technics.xlsx               # Таблица техник
```

---

## Особенности проекта

- **MPA (Multi-Page Application)** — Vite автоматически подхватывает все `.html` файлы в `src/` (кроме папки `partials/`).
- **Кастомный плагин `vite-plugin-html-include.js`** — позволяет подключать HTML-фрагменты (партиалы) через `@@include`.
- **SCSS** — стили разбиты по слоям: `base`, `components`, `layout`, `form`, `pages`, `utilities`, все импортируются в `src/styles/main.scss`.
- **JS-зависимости (npm):** `swiper`, `just-validate`, `inputmask`, `sass`.
- **PHP** — используется для обработки форм, письма отправляются через PHPMailer.

---

## Развёртывание

### Фронтенд (Vite-сборка)

```bash
npm run build
```

Результат попадает в папку `/dist`. Можно выложить на любой статический хостинг (Nginx, Apache, GitHub Pages, Netlify и т.д.).

### С поддержкой PHP

Выложить на хостинг/сервер с PHP. Файлы `php/*.php` (обработчики форм) будут выполняться на стороне сервера. В `php/`-скриптах используется PHPMailer для отправки писем.

---

## Контакты

**Автор:** [@viktorygis](https://github.com/viktorygis)
