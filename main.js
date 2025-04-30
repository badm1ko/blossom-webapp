/* ------------ навигация между страницами --------------- */
const tabs   = document.querySelectorAll("#tabs button");
const pages  = document.querySelectorAll(".page");

tabs.forEach(btn=>{
  btn.addEventListener("click",()=>{
    tabs.forEach(b=>b.classList.toggle("active",b===btn));
    pages.forEach(p=>p.classList.toggle("visible",p.id==="page-"+btn.dataset.page));
  });
});

/* ------------ модалка «Команда» ------------------------- */
const members = {
  maria:{
    name:"Мария",
    role:"Главный флорист",
    img :"https://i.pravatar.cc/140?u=dmitry",
    bio :`15 лет создаёт авторские букеты, 
          проходила стажировки в Париже и Амстердаме.`
  },
  alex:{
    name:"Алексей",
    role:"Креативный директор",
    img :"https://i.pravatar.cc/140?u=alex",
    bio :"Отвечает за тренды и цветовые сочетания, вдохновляется современной живописью."
  },
  kate:{
    name:"Екатерина",
    role:"Декоратор",
    img :"https://i.pravatar.cc/140?u=kate",
    bio :"Оформляет мероприятия «под ключ», мастер японской техники икебана."
  },
  dmitry:{
    name:"Дмитрий",
    role:"Логистика",
    img :"https://i.pravatar.cc/140?u=maria",
    bio :"Следит, чтобы каждый букет приехал вовремя и в идеальном состоянии."
  }
};

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
document.getElementById("modal-close").onclick = ()=> modal.classList.add("hidden");

document.querySelectorAll(".team-grid figure").forEach(fig=>{
  fig.addEventListener("click",()=>{
    const m = members[fig.dataset.member];
    if(!m) return;
    modalContent.innerHTML = `
      <img src="${m.img}" alt="">
      <h3>${m.name}</h3>
      <p><i>${m.role}</i></p>
      <p>${m.bio}</p>`;
    modal.classList.remove("hidden");
  });
});

/* закрытие по клику вне окна */
modal.addEventListener("click",e=>{
  if(e.target===modal) modal.classList.add("hidden");
});
