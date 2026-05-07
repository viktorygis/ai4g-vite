import "./styles/main.scss";
import "swiper/css";
import Swiper from "swiper";
import Inputmask from "inputmask";

import { showMore } from "./scripts/modules/show-more.js";
import { fairwayAnim } from "./scripts/modules/fairway-anim.js";
import { mentorsAnim } from "./scripts/modules/mentors-anim.js";
import { choiceAnim } from "./scripts/modules/choice-anim.js";
import { partnersAnim } from "./scripts/modules/partners-anim.js";
import { cutText } from "./scripts/modules/cut-text.js";
import { firefoxFix } from "./scripts/modules/firefox-fix.js";
import { formValidation } from "./scripts/modules/form-validation.js";
import { btnValidation } from "./scripts/modules/btn-validation.js";
import { scrollUp2 } from "./scripts/modules/scroll-up.js";
import { initMenu } from "./scripts/modules/menu.js";

// ============== ЛОКАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ Swiper (если нужно) ==========
if (document.querySelector(".swiper")) {
  new Swiper(".swiper", {
    speed: 400,
    spaceBetween: 50,
    slidesPerView: 1,
    allowTouchMove: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  showMore();
  fairwayAnim();
  mentorsAnim();
  choiceAnim();
  partnersAnim();
  cutText();
  firefoxFix();
}

formValidation();
btnValidation();
scrollUp2();
initMenu();
