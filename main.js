/* --------------- переключение вкладок ------------------ */
const tabs = document.querySelectorAll("#tabs button");
const pages = document.querySelectorAll(".page");

tabs.forEach(btn => btn.addEventListener("click", () => {
  // активная кнопка
  tabs.forEach(b => b.classList.toggle("active", b === btn));
  // показываем нужную страницу
  pages.forEach(sec => {
    sec.classList.toggle("visible", sec.id === "page-" + btn.dataset.page);
  });
}));

/* --------------- запуск сцены с лепестками ------------- */
import "./flower3d.js";
