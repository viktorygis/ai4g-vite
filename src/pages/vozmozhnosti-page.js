// src/pages/vozmozhnosti.js



/* Плавная прокрутка к якорю */
document.querySelectorAll('.category').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const targetId = this.getAttribute('href');
		const targetElement = document.querySelector(targetId);
		if (!targetElement) return;
		const scrollToTarget = (targetElement) => {
			const topPos = targetElement.getBoundingClientRect().top + window.pageYOffset;
			const distance = topPos - window.pageYOffset;
			const duration = 600;
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

/* Аккордеон категорий */
function initializeCollapsibleSections() {
	const categories = document.querySelectorAll('.vozmozhnosti__category');
	categories.forEach(function (category) {
		const top = category.querySelector('.vozmozhnosti__top-category');
		if (top) { // Добавим защиту от отсутствия top-контейнера
			top.addEventListener('click', function () {
				category.classList.toggle('active');
			});
		}
	});
}
initializeCollapsibleSections();