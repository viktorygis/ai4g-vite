//scrollUp - функция для отображения кнопки "scrollUp" при прокрутке страницы вниз и плавного скролла вверх при клике на эту кнопку.

export function scrollUp() {
  const el = document.querySelector(".scrollUp");
  if (!el) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 499) el.classList.add("active");
    else el.classList.remove("active");
  });
  el.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function scrollUp2() {
  const scrollUp = document.querySelector(".scrollUp");
  window.addEventListener("scroll", () => {
    if (scrollY > 499) scrollUp.classList.add("active");
    else scrollUp.classList.remove("active");
  });
  scrollUp.addEventListener("click", () => {
    $("html, body").animate(
      { scrollTop: $("#top").offset().top },
      "slow"
    );
  });
}