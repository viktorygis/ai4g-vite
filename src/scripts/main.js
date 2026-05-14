import "../styles/main.scss";

import Swiper from "swiper";
import "swiper/css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
Swiper.use([Navigation, Pagination, Autoplay]);
import Inputmask from "inputmask";

import { showMore } from "./modules/show-more.js";
import { fairwayAnim } from "./modules/fairway-anim.js";
import { mentorsAnim } from "./modules/mentors-anim.js";
import { choiceAnim } from "./modules/choice-anim.js";
import { partnersAnim } from "./modules/partners-anim.js";
import { cutText } from "./modules/cut-text.js";
import { firefoxFix } from "./modules/firefox-fix.js";
import { formValidation } from "./modules/form-validation.js";
import { btnValidation } from "./modules/btn-validation.js";
import { scrollUp2 } from "./modules/scroll-up.js";
import { initMenu } from "./modules/menu.js";

// ============== ЛОКАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ Swiper (если нужно) ==========

new Swiper(".swiper", {
  speed: 400,
  spaceBetween: 50,
  slidesPerView: 1,
  allowTouchMove: false,
  navigation: {
    nextEl: ".swiper-arrows .swiper-button-next",
    prevEl: ".swiper-arrows .swiper-button-prev",
  },
});
showMore();
fairwayAnim();
mentorsAnim();
choiceAnim();
partnersAnim();
cutText();
firefoxFix();

formValidation();
btnValidation();
scrollUp2();
initMenu();

document.querySelectorAll(".open-payment").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Заголовок, сумма, услуга:
    document.getElementById("payment-title").innerHTML = btn.dataset.title || "Оплата";
    document.getElementById("sum").value = btn.dataset.sum || "";
    document.getElementById("service_name").value = btn.dataset.service || "";

    // Выбор цены (если нужен)
    const priceChoices = btn.dataset.priceChoices;
    const priceChoicesDiv = document.getElementById("price-choices");
    if (priceChoices) {
      priceChoicesDiv.innerHTML = "";
      priceChoicesDiv.style.display = "";
      priceChoices.split(",").forEach((pair) => {
        const [price, label] = pair.split(":");
        priceChoicesDiv.innerHTML += `
          <label class="payment__label">
            <input class="payment__radio" type="radio" name="payment_option" value="${price}" onchange="document.getElementById('sum').value=${price}" required />
            <span>${label} - ${price.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
          </label>
        `;
      });
      // Дефолт — поставить сумму первой опции
      const firstVal = priceChoices.split(",")[0].split(":")[0];
      document.getElementById("sum").value = firstVal;
    } else {
      priceChoicesDiv.style.display = "none";
    }

    // Сохраняем параметры для окна "Спасибо"
    document.getElementById("thanks-title").innerHTML = btn.dataset.thanksTitle || "Спасибо!";
    document.getElementById("thanks-text").innerHTML = btn.dataset.thanksText || "";

    // Сброс формы
    document.getElementById("payment-form").reset();

    // Покажи попап оплаты (зависит от реализации!)
    document.getElementById("payment-modal").style.display = "";
    // Для плавного закрытия можешь сделать через класс и transition, а не через display.
  });
});

const payForm = document.getElementById("payment-form");
if (payForm) {
  payForm.addEventListener("submit", function (e) {
    // e.preventDefault();
    // document.getElementById('payment-modal').style.display = 'none';
    // document.getElementById('successful-payment-modal').style.display = '';
    // setTimeout(() => document.getElementById('successful-payment-modal').style.display = 'none', 4000);
  });
}
