const pages = {
  about: `
    <div class="card">
      <h3>О нас</h3>
      <p>Blossom Boutique — это команда флористов, которые превращают эмоции в букеты
         уже более 5 лет. Мы работаем только с свежими цветами, а каждая композиция
         собирается вручную и с любовью ❤️</p>
    </div>`,
  reviews: `
    <div class="card review">
      <img src="https://i.pravatar.cc/80?img=5" alt="">
      <p><b>Анна:</b> «Букет превзошёл ожидания! Курьер доставил точно ко времени»</p>
    </div>
    <div class="card review">
      <img src="https://i.pravatar.cc/80?img=12" alt="">
      <p><b>Олег:</b> «Заказывал маме на день рождения – она в восторге. Спасибо!»</p>
    </div>`,
  team: `
    <div class="card">
      <h3>Наша команда</h3>
      <p><b>Мария</b> – главный флорист<br>
         <b>Виктор</b> – дизайнер композиций<br>
         <b>Ксения</b> – менеджер доставки</p>
    </div>`,
  contacts: `
    <div class="card">
      <h3>Контакты</h3>
      <p>Телефон: +7 900 123-45-67<br>
         Instagram: @blossom.bqt<br>
         Адрес шоу-рума: г. Самара, ул. Цветочная, 15</p>
    </div>`
};

const container = document.getElementById("page-container");
const navBtns   = document.querySelectorAll("nav button");

function openPage(id){
  navBtns.forEach(b=>b.classList.toggle("active", b.dataset.page===id));
  container.innerHTML = pages[id] || "";
}
navBtns.forEach(b => b.addEventListener("click", () => openPage(b.dataset.page)));

// стартовая страница
openPage("about");
