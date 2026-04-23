export function showMore() {
  const btnReadMore = document.querySelector(".plane__btn");
  const planeItems = document.querySelector(".plane__bottom-items");
  if (btnReadMore && planeItems) {
    btnReadMore.addEventListener("click", () => {
      planeItems.classList.toggle("active");
    });
  }
}
