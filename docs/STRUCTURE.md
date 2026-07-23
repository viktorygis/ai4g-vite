Файл `STRUCTURE.md` описывает структуру проекта, включая папки, файлы и их назначение. Ниже приведено краткое описание основных элементов проекта.

## Структура проекта

```
ai4g-vite/
├── .github/                   # Workflows GitHub Actions (CI/CD)
├── .well-known/               # SSL- и доменные проверки (например, LetsEncrypt)
├── dist/                      # Продакшн-сборка (результат `npm run build`)
├── node_modules/              # Зависимости npm
├── php/                       # Серверные скрипты для обработки форм (mail, оплаты)
│   ├── download.php           # Скрипт для скачивания файлов (например, картинок техник)
│   ├── env.php                # Файл с настройками окружения (например, SMTP)
│   ├── form_handler.php       # Скрипт для обработки форм (отправка писем)
│   ├── info.php               # Скрипт для вывода информации о сервере (phpinfo)
│   ├── mail.php               # Скрипт для отправки писем через PHPMailer
│   ├── pay.php                # Скрипт для обработки платежей (например, через платежный шлюз)
│   ├── payment-success.php    # Скрипт для обработки успешной оплаты
│   └── payment.php            # Скрипт для обработки платежей (например, через платежный шлюз)
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
│   │   ├── technics-page.js        # JS-логика для страницы technics.html (каталог техник)
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
