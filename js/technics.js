
/* Стрелка */
function scrollUp() {
	const scrollUp = document.querySelector(".scrollUp");
	window.addEventListener("scroll", (() => {
		if (scrollY > 499) scrollUp.classList.add("active"); else scrollUp.classList.remove("active");
	}));
	scrollUp.addEventListener("click", (() => {
		$("html, body").animate({
			scrollTop: $("#top").offset().top
		}, "slow");
	}));
}
scrollUp();

/* sort---------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
	// Элементы, связанные с сортировкой
	const sortDropdown = document.querySelector('.sort__dropdown');
	const sortSelected = sortDropdown.querySelector('.sort__selected');
	const sortSelectedArrow = sortDropdown.querySelector('.sort__selected-arrow');
	const sortOptions = sortDropdown.querySelector('.sort__options');
	const sortOptionElements = sortDropdown.querySelectorAll('.sort__option');

	// Переменные для хранения активных значений фильтра
	let activeCategory = null;
	let activeTimeRange = null;
	let activeSortOrder = 'default';

	// Элемент-заглушка для отображения, когда карточек нет
	const noCardsPlaceholder = document.getElementById('no-cards-placeholder');

	// Инициализация параметров из URL
	const urlParams = new URLSearchParams(window.location.search);
	activeCategory = urlParams.get('category') || null;
	activeTimeRange = urlParams.get('time') || null;

	// Применяем начальные настройки фильтра
	filterCards(activeCategory, activeTimeRange);
	updateResetButtonVisibility();
	loadExcelFile();

	// Функция для управления классами активности и обновления выбранного элемента сортировки
	function updateActiveClass(element, elements) {
		elements.forEach(opt => opt.classList.remove('active'));
		element.classList.add('active');
		updateSortSelected(element);
	}

	// Обработчик клика на элемент сортировки
	sortSelected.addEventListener('click', () => {
		sortOptions.style.display = sortOptions.style.display === 'none' ? 'block' : 'none';
	});

	// Обработчики клика для опций сортировки


	sortOptionElements.forEach(option => {
		option.addEventListener('click', () => {
			updateActiveClass(option, sortOptionElements);
			activeSortOrder = option.dataset.value;
			sortOptions.style.display = 'none';
			sortCards(activeSortOrder);
		});
	}
	);

	// Скрытие опций сортировки при клике вне Dropdown
	document.addEventListener('click', (event) => {
		if (!sortDropdown.contains(event.target)) {
			sortOptions.style.display = 'none';
		}
	});

	// Функция для применения фильтра и сортировки
	function applyFiltersAndSorting() {
		filterCards(activeCategory, activeTimeRange);
		sortCards(activeSortOrder);
		updateResetButtonVisibility();

		const activeOption = sortDropdown.querySelector(`.sort__option[data-value="${activeSortOrder}"]`);
		if (activeOption) {
			updateSortSelected(activeOption);
		}
	}

	// Обработчики клика для кнопок фильтров
	document.querySelectorAll('.filter__btn').forEach(btn => {
		btn.addEventListener('click', () => {
			toggleFilter(btn.dataset.category, btn.dataset.time);
			applyFiltersAndSorting();
		});
	});


	// Обработчик клика на кнопку сброса фильтров
	const resetFilterButton = document.querySelector('.reset-filter[data-reset="all"]');
	if (resetFilterButton) {
		resetFilterButton.addEventListener('click', () => {
			activeCategory = null;
			activeTimeRange = null;
			activeSortOrder = 'default';
			filterCards(activeCategory, activeTimeRange);
			updateResetButtonVisibility();

			const sortDropdown = document.querySelector('.sort__dropdown');
			if (sortDropdown) {
				const defaultOption = sortDropdown.querySelector('.sort__option[data-value="default"]');
				if (defaultOption) {
					updateActiveClass(defaultOption, sortOptionElements);
					updateSortSelected(defaultOption);
					sortCards(activeSortOrder); // Применяем сортировку по умолчанию
				}
			}
		});
	}




	// Вспомогательная функция для переключения состояний фильтра
	function toggleFilter(category, timeRange) {
		if (category !== 'all') {
			activeCategory = (activeCategory === category) ? null : category; // Тоггл категории
		}
		if (timeRange !== 'all') {
			activeTimeRange = (activeTimeRange === timeRange) ? null : timeRange; // Тоггл времени
		}
	}

	// Функция для фильтрации карточек на основе выбранной категории и диапазона времени
	function filterCards(category, timeRange) {
		const cards = document.getElementsByClassName('card');
		let hasVisibleCards = false;

		// Убираем активный класс со всех кнопок фильтров
		const filterButtons = document.querySelectorAll('.filter__btn');
		filterButtons.forEach(btn => btn.classList.remove('active'));

		// Добавляем активный класс к кнопкам, соответствующим выбранным фильтрам
		if (category) {
			const categoryButton = document.querySelector(`.filter__btn[data-category="${category}"]`);
			if (categoryButton) categoryButton.classList.add('active');
		}
		if (timeRange) {
			const timeButton = document.querySelector(`.filter__btn[data-time="${timeRange}"]`);
			if (timeButton) timeButton.classList.add('active');
		}

		// Фильтруем карточки на основе выбранных параметров категории и времени
		for (let i = 0; i < cards.length; i++) {
			const card = cards[i];
			const cardCategory = card.dataset.tag;
			const cardTimeRange = card.dataset.time;

			// Проверка на соответствие фильтрам
			if ((!category || cardCategory === category) && (!timeRange || cardTimeRange === timeRange)) {
				card.classList.remove('hidden');  // Показываем карточку, если она соответствует фильтрам
				hasVisibleCards = true;          // Найдена хотя бы одна видимая карточка
			} else {
				card.classList.add('hidden');     // Скрываем карточку, если она не соответствует фильтрам
			}
		}

		// Обновляем видимость заглушки в зависимости от наличия видимых карточек
		if (noCardsPlaceholder) {
			noCardsPlaceholder.style.display = hasVisibleCards ? 'none' : 'block';
		}

		// Обновляем URL, чтобы отразить текущие фильтры
		updateURL(category, timeRange);
	}

	// Функция для обновления текста сортировки
	function updateSortSelected(option) {
		const selectedSpan = sortSelected.querySelector('span');
		if (selectedSpan) {
			selectedSpan.textContent = option.querySelector('span').textContent;
		}

		const selectedValue = option.dataset.value;
		sortSelectedArrow.style.display = (selectedValue !== 'default') ? 'inline-block' : 'none';
		sortSelectedArrow.classList.toggle('sort__option_02', selectedValue === 'desc');
	}

	// Функция для сортировки карточек в зависимости от выбранного порядка
	function sortCards(order) {
		const cardsContainer = document.querySelector('.tekhniki__body');
		const cards = Array.from(cardsContainer.querySelectorAll('.card'));

		if (order === 'default') {
			cards.sort((a, b) => {
				const indexA = parseInt(a.getAttribute('data-index'));
				const indexB = parseInt(b.getAttribute('data-index'));
				return indexA - indexB;
			});
		} else {
			cards.sort((a, b) => {
				const titleA = a.querySelector('.card__subtitle').textContent.trim().toLowerCase();
				const titleB = b.querySelector('.card__subtitle').textContent.trim().toLowerCase();
				return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
			});
		}

		cards.forEach(card => cardsContainer.appendChild(card));
	}

	// Функция для обновления видимости кнопки сброса фильтров
	function updateResetButtonVisibility() {
		const resetButton = document.querySelector('.reset-filter[data-reset="all"]');
		resetButton.style.display = (activeCategory || activeTimeRange) ? 'inline-block' : 'none';
	}

	// Функция для обновления URL в зависимости от выбранных фильтров
	function updateURL(category, timeRange) {
		const params = new URLSearchParams();
		if (category) {
			params.set('category', category);
		}
		if (timeRange) {
			params.set('time', timeRange);
		}
		const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
		history.replaceState(null, '', newUrl);
	}


	// Загрузка данных из Excel-файла
	function loadExcelFile() {
		// Вспомогательная функция для определения диапазона времени
		const getTimeRange = (time) => {
			const minutes = parseInt(time);
			if (minutes < 10) return 'lt10';
			if (minutes >= 10 && minutes < 30) return '10-30';
			if (minutes >= 30 && minutes < 60) return '30-60';
			return 'all';
		};

		fetch('technics.xlsx')
			.then(response => response.arrayBuffer())
			.then(data => {
				const workbook = XLSX.read(data, { type: 'array' });
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

				const cardsContainer = document.querySelector('.tekhniki__body');
				cardsContainer.innerHTML = ''; // Очищаем контейнер

				// Создаём карточки на основе данных
				for (let i = 1; i < jsonData.length; i++) {
					const row = jsonData[i];
					const dataTag = row[3];
					const subtitle = row[4];
					const description = row[5];
					const category = row[2];
					const time = row[8];
					const link = row[6];
					const imageUrl = row[7];

					// Создаем новую карточку и заполняем её данными
					const card = document.createElement('div');
					card.className = 'card';
					card.setAttribute('data-tag', dataTag);
					card.setAttribute('data-time', getTimeRange(time));
					card.setAttribute('data-index', i);

					card.innerHTML = `
			  <div class="card__body">
				 <div class="card__top">
					<div class="card__img">
					  <img src="${imageUrl}" alt="">
					</div>
					<h3 class="card__subtitle">${subtitle}</h3>
					<div class="card__description">${description}</div>
					<div class="card__category ${dataTag}">${category}</div>
				 </div>
				 <div class="card__time">${time}</div>
				 <a href="${link}" class="card__link">
					Подробнее
				 </a>
			  </div>
			`;

					cardsContainer.appendChild(card); // Добавляем карточку в контейнер
				}

				// Применяем фильтрацию и сортировку после загрузки карточек
				filterCards(activeCategory, activeTimeRange);
				sortCards(activeSortOrder);
				updateResetButtonVisibility();
			})
			.catch(error => console.error('Ошибка при загрузке или обработке файла Excel:', error));
	}

	// Применяем начальную сортировку
	sortCards(activeSortOrder);
});