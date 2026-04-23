// Функция для отображения кнопки прокрутки вверх
function scrollUp() {
	const scrollUp = document.querySelector(".scrollUp");

	// Отображать кнопку при прокрутке
	window.addEventListener("scroll", () => {
		if (window.scrollY > 499) {
			scrollUp.classList.add("active");
		} else {
			scrollUp.classList.remove("active");
		}
	});

	// Прокрутка вверх при нажатии на кнопку
	scrollUp.addEventListener("click", () => {
		window.scrollTo({
			top: 0, // Прокрутка к началу страницы
			behavior: "smooth" // Эффект анимации
		});
	});
}

scrollUp();
