export function initPaymentModal() {
  const buttons = document.querySelectorAll(".open-payment");

  if (!buttons.length) return;

  const form = document.getElementById("payment-form");
  const modal = document.getElementById("payment-modal");

  const sumInput = document.getElementById("sum");
  const serviceInput = document.getElementById("service_name");

  const priceChoicesDiv =
    document.getElementById("price-choices");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {

      // ==================== RESET ====================

      if (form) {
        form.reset();
      }

      // ==================== INPUTS ====================

      if (sumInput) {
        sumInput.value = btn.dataset.sum || "";
      }

      if (serviceInput) {
        serviceInput.value =
          btn.dataset.service || "";
      }

      // ==================== PRICE CHOICES ====================

      const priceChoices =
        btn.dataset.priceChoices;

      if (priceChoices && priceChoicesDiv) {

        priceChoicesDiv.style.display = "block";

        const html = priceChoices
          .split(",")
          .map((pair, index) => {

            const [price, label] =
              pair.split(":");

            return `
              <label class="payment__label">
                <input
                  class="payment__radio"
                  type="radio"
                  name="payment_option"
                  value="${price}"
                  ${index === 0 ? "checked" : ""}
                  required
                />

                <span>
                  ${label} —
                  ${price.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    " "
                  )}
                </span>
              </label>
            `;
          })
          .join("");

        priceChoicesDiv.innerHTML = html;

        const radios =
          priceChoicesDiv.querySelectorAll(
            ".payment__radio"
          );

        radios.forEach((radio) => {
          radio.addEventListener(
            "change",
            () => {
              if (sumInput) {
                sumInput.value =
                  radio.value;
              }
            }
          );
        });

        const firstValue =
          priceChoices
            .split(",")[0]
            .split(":")[0];

        if (sumInput) {
          sumInput.value = firstValue;
        }

      } else if (priceChoicesDiv) {

        priceChoicesDiv.style.display = "none";
      }

      // ==================== OPEN MODAL ====================

      if (modal) {
        modal.style.display = "block";
      }
    });
  });

  // ==================== SUBMIT ====================

  if (form) {
    form.addEventListener("submit", () => {

      // e.preventDefault();

      // modal.style.display = "none";

    });
  }
}