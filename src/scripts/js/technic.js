
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
