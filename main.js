/******** Навигация между страницами ********/
const tabs  = document.querySelectorAll("#tabs button");
const pages = document.querySelectorAll(".page");
tabs.forEach(btn=>{
  btn.onclick = ()=>{
    tabs.forEach(b=>b.classList.toggle("active",b===btn));
    pages.forEach(p=>p.classList.toggle("visible",p.id==="page-"+btn.dataset.page));
  };
});

/******** Карусель отзывов ********/
const track   = document.querySelector(".carousel .track");
const cards   = Array.from(track.children);
const btnL    = document.querySelector(".carousel .nav.left");
const btnR    = document.querySelector(".carousel .nav.right");
let index = 0;

function updateCarousel(){
  track.style.transform = `translateX(-${index*100}%)`;
  btnL.disabled = index===0;
  btnR.disabled = index===cards.length-1;
}
btnL.onclick = ()=>{ if(index>0){index--;updateCarousel();}};
btnR.onclick = ()=>{ if(index<cards.length-1){index++;updateCarousel();}};
updateCarousel();

/******** Модалка «Команда» ********/
const members = {
  maria:{name:"Мария",role:"Главный флорист",img:"https://i.pravatar.cc/140?u=maria",bio:"15 лет создаёт авторские букеты, проходила стажировки в Париже и Амстердаме."},
  alex :{name:"Алексей",role:"Креативный директор",img:"https://i.pravatar.cc/140?u=alex", bio:"Отвечает за тренды и цветовые сочетания, вдохновляется современной живописью."},
  kate :{name:"Екатерина",role:"Декоратор",img:"https://i.pravatar.cc/140?u=kate", bio:"Оформляет мероприятия «под ключ», мастер японской техники икебана."},
  dmitry:{name:"Дмитрий",role:"Логистика",img:"https://i.pravatar.cc/140?u=dmitry",bio:"Следит, чтобы каждый букет приехал вовремя и в идеальном состоянии."}
};
const modal = document.getElementById("modal");
const content = document.getElementById("modal-content");
document.getElementById("modal-close").onclick=()=>modal.classList.add("hidden");
document.querySelectorAll(".team-grid figure").forEach(f=>{
  f.onclick=()=>{
    const m = members[f.dataset.member];
    if(!m)return;
    content.innerHTML=`<img src="${m.img}"><h3>${m.name}</h3><p><i>${m.role}</i></p><p>${m.bio}</p>`;
    modal.classList.remove("hidden");
  };
});
modal.onclick=e=>{if(e.target===modal)modal.classList.add("hidden");};
