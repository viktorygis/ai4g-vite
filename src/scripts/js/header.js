const menuToggle = document.querySelector(".icon-menu");
const menuBody = document.querySelector(".menu__body");

// Функция для открытия и закрытия основного меню
function toggleMenu() {
    if (menuBody) {
        document.documentElement.classList.toggle("menu-open");
    }
}

// Функция для закрытия подменю
function closeSubmenu(parentItem) {
    const submenu = parentItem.querySelector(".submenu");
    if (submenu) {
        submenu.style.display = "none"; // Закрываем подменю
        parentItem.classList.remove("active"); // Убираем класс active
    }
}

// Функция для открытия/закрытия подменю
function toggleSubmenu(link) {
    const parentItem = link.closest(".menu__item--dropdown");
    const submenu = parentItem.querySelector(".submenu");
    if (submenu) {
        parentItem.classList.toggle("active"); // Переключаем класс active
        // Проверяем, открыто ли подменю
        if (submenu.style.display === "block") {
            closeSubmenu(parentItem); // Закрываем подменю
        } else {
            submenu.style.display = "block"; // Открываем подменю
        }
    }
}

// Функция для обработки клика вне меню
function handleClickOutsideMenu(e) {
    if (menuBody && !menuBody.contains(e.target) && !menuToggle.contains(e.target)) {
        document.documentElement.classList.remove("menu-open"); // Закрываем основное меню
    }

    // Закрываем подменю, если кликнули вне него
    const dropdownLinks = document.querySelectorAll(".menu__link--dropdown");
    dropdownLinks.forEach((link) => {
        const parentItem = link.closest(".menu__item--dropdown");
        const submenu = parentItem.querySelector(".submenu");
        if (parentItem && !parentItem.contains(e.target) && submenu && submenu.style.display === "block") {
            closeSubmenu(parentItem); // Закрываем подменю, если кликнули вне него
        }
    });
}

// Функция для инициализации обработчиков событий
function initDropdownMenu() {
    const dropdownLinks = document.querySelectorAll(".menu__link--dropdown");

    dropdownLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Предотвращаем переход по ссылке
            toggleSubmenu(this); // Открываем/закрываем текущее подменю
        });
    });

    document.addEventListener("click", handleClickOutsideMenu); // Обработка клика вне меню
}

// Инициализация
if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu); // Обработчик клика на иконку меню
}

document.addEventListener("DOMContentLoaded", function () {
    initDropdownMenu(); // Инициализация функционала подменю
});
