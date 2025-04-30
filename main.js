// ───────── маленький помощник ─────────
const $ = s => document.querySelector(s);

// ───────── вкладки (навигация) ────────
$('#tabs').onclick = e=>{
  if(e.target.dataset.tab){
    document.querySelectorAll('#tabs button').forEach(b=>b.classList.remove('active'));
    e.target.classList.add('active');

    document.querySelectorAll('main section').forEach(sec=>sec.classList.add('hidden'));
    $('#'+e.target.dataset.tab).classList.remove('hidden');
  }
};
// активируем первую вкладку
$('#tabs button[data-tab="about"]').click();

// ───────── отзывы ─────────────────────
const reviews=[
  {user:"Мария", text:"💐 Самые свежие цветы в городе!"},
  {user:"Дмитрий",text:"Сюрприз удался — девушка в восторге."},
  {user:"Катя",   text:"Очень красиво упаковали, курьер вежливый."}
];
const track = $('#rev-track');
reviews.forEach(r=>{
  const div=document.createElement('div');
  div.className='review';
  div.innerHTML=`<blockquote>“${r.text}”</blockquote><small>— ${r.user}</small>`;
  track.appendChild(div);
});
let idx=0;
function slide(i){ track.style.transform=`translateX(${-100*i}%)`; }
$('#rev-prev').onclick=_=>{ idx=(idx-1+reviews.length)%reviews.length; slide(idx);};
$('#rev-next').onclick=_=>{ idx=(idx+1)%reviews.length; slide(idx);};

// ───────── команда ────────────────────
const staff=[
  {name:"Елена", role:"Флорист-дизайнер", src:"img/elena.jpg"},
  {name:"Игорь", role:"Флорист-декоратор", src:"img/igor.jpg"},
  {name:"Ольга", role:"Менеджер", src:"img/olga.jpg"},
  {name:"Арти",  role:"Курьер",   src:"img/arty.jpg"}
];
const grid = $('#staff');
staff.forEach(p=>{
  const c=document.createElement('div'); c.className='card';
  c.innerHTML=`<img src="${p.src}" alt=""><br><b>${p.name}</b><br><small>${p.role}</small>`;
  grid.appendChild(c);
});
