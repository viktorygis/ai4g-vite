import Inputmask from 'inputmask';
import JustValidate from 'just-validate';

export function formValidation() {
  const form = document.querySelector(".modal-request__form");
  if (!form) return;

  const pageTitleField = form.querySelector('[name="page_title"]');
  if (pageTitleField) {
    pageTitleField.value = document.title;
  }

  appendUtmFields(form);
  form.dataset.utmAdded = 'true';

  const telSelector = form.querySelector(".modal-request__phone");
  if (telSelector) {
    const inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(telSelector);
  }

  const validation = new JustValidate(".modal-request__form", {
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
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.status === 'ok') {
                if (window.$ && $.fancybox) {
                  $.fancybox.close();
                  $.fancybox.open({ src: "#modal-thanks", type: "inline" });
                } else {
                  const thanks = document.getElementById("modal-thanks");
                  if (thanks) thanks.style.display = "block";
                }
                if (typeof grecaptcha !== "undefined") grecaptcha.reset();
                event.target.reset();
                const resetPageTitleField = event.target.querySelector('[name="page_title"]');
                if (resetPageTitleField) {
                  resetPageTitleField.value = document.title;
                }
              } else {
                console.error("Ошибка отправки формы:", response);
                alert("Произошла ошибка при отправке. Попробуйте позже.");
              }
            } catch (e) {
              console.error("Ошибка парсинга ответа:", e);
              alert("Произошла ошибка при отправке. Попробуйте позже.");
            }
          } else {
            alert("Ошибка сети. Попробуйте позже.");
          }
        }
      };

      xhr.open("POST", "/php/mail.php", true);
      xhr.send(formData);
    });

  if (window.$) {
    $(document).off('afterLoad.fb.modalRequest').on('afterLoad.fb.modalRequest', function () {
      const form = document.querySelector(".modal-request__form");
      if (form && !form.dataset.utmAdded) {
        appendUtmFields(form);
        form.dataset.utmAdded = 'true';
        const pageTitleField = form.querySelector('[name="page_title"]');
        if (pageTitleField && !pageTitleField.value) {
          pageTitleField.value = document.title;
        }
      }
    });
  }
}

function appendUtmFields(form) {
  const params = new URLSearchParams(window.location.search);
  ['bc', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term'].forEach((key) => {
    if (form.querySelector(`input[name="${key}"]`)) return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params.get(key) || '';
    form.appendChild(input);
  });
}
