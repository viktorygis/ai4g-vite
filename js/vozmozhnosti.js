/* Стрелка */
function scrollUp() {
	const scrollUp = document.querySelector(".scrollUp");

	// Добавляем обработчик события скролла
	window.addEventListener("scroll", () => {
		// Если прокрутка больше 499 пикселей, добавляем класс active
		if (window.scrollY > 499) {
			scrollUp.classList.add("active");
		} else {
			scrollUp.classList.remove("active");
		}
	});

	// Добавляем обработчик клика на элемент scrollUp
	scrollUp.addEventListener("click", () => {
		// Плавная прокрутка к началу страницы
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	});
}

// Вызываем функцию
scrollUp();

/* Плавная прокрутка к элементу */
document.querySelectorAll('.category').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();

		const targetId = this.getAttribute('href');
		const targetElement = document.querySelector(targetId);

		// Проверяем, существует ли целевой элемент
		if (!targetElement) return;

		const scrollToTarget = (targetElement) => {
			const topPos = targetElement.getBoundingClientRect().top + window.pageYOffset;
			const distance = topPos - window.pageYOffset;
			const duration = Math.max(600, 100); // Защита от слишком короткой анимации
			const start = window.pageYOffset;
			let startTime = null;

			const animateScroll = (currentTime) => {
				if (startTime === null) startTime = currentTime;
				const timeElapsed = currentTime - startTime;
				const progress = Math.min(timeElapsed / duration, 1);

				const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

				window.scrollTo(0, start + distance * ease);
				if (timeElapsed < duration) requestAnimationFrame(animateScroll);
			};

			requestAnimationFrame(animateScroll);
		};

		scrollToTarget(targetElement);
	});
});



function initializeCollapsibleSections() {
	// Получаем все элементы с классом 'vozmozhnosti__category'
	const categories = document.querySelectorAll('.vozmozhnosti__category');

	categories.forEach(function (category) {
		// Добавляем обработчик события клика на each элементе 'vozmozhnosti__top'
		const top = category.querySelector('.vozmozhnosti__top-category');
		top.addEventListener('click', function () {
			// Переключаем класс 'active' для родительского элемента
			category.classList.toggle('active');
		});
	});
}

initializeCollapsibleSections() 