export function firefoxFix() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mozila = /firefox/.test(userAgent);
  const link = document.querySelector(".fairway__link");
  if (mozila && link) link.style.marginTop = "-7px";
}