import Inputmask from 'inputmask';
import JustValidate from 'just-validate';

export function formValidation() {
  const form = document.querySelector(".modal-request__form");
  if (!form) return;

  const telSelector = form.querySelector(".modal-request__phone");
  if (telSelector) {
    const inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(telSelector);
  }

  const validation = new window.JustValidate(".modal-request__form", {
    errorFieldCssClass: "is-invalid",
    successFieldCssClass: "is-valid",
  });

  validation
    .addField(".modal-request__name", [
      { rule: "minLength", value: 2 },
      { rule: "maxLength", value: 50 },
      { rule: "required", value: true, errorMessage: "Введите имя" },
    ])
    .addField(".modal-request__phone", [
      { rule: "required", value: true, errorMessage: "Введите телефон" },
    ])
    .addField(".modal-request__email", [
      { rule: "required", value: true, errorMessage: "Введите электронную почту" },
      { rule: "email", value: true, errorMessage: "Введите корректную электронную почту" },
    ])
    .onValidate(() => {
      const recaptchaError = document.getElementById("recaptchaError");
      if (typeof grecaptcha !== "undefined") {
        if (grecaptcha.getResponse().length === 0) {
          if (recaptchaError) recaptchaError.style.display = "block";
          return false;
        }
        if (recaptchaError) recaptchaError.style.display = "none";
        return true;
      } else {
        if (recaptchaError) {
          recaptchaError.textContent = "Капча недоступна. Попробуйте позже.";
          recaptchaError.style.display = "block";
        }
        return false;
      }
    })
    .onSuccess((event) => {
      const formData = new FormData(event.target);
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (window.$ && $.fancybox) {
            $.fancybox.close("fancybox-content");
            $.fancybox.open({ src: "#modal-thanks", type: "inline" });
          } else {
            const thanks = document.getElementById("modal-thanks");
            if (thanks) thanks.style.display = "block";
          }
          if (typeof grecaptcha !== "undefined") grecaptcha.reset();
          event.target.reset();
        }
      };

      xhr.open("POST", "mail.php", true);
      xhr.send(formData);
    });
}