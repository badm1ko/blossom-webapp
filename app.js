// --- глобальные переменные -----------------------------------------
let products = [];
let filtered  = [];
let cart      = [];
let promoActive = false;

// ---------- helpers -------------------------------------------------
const $ = s => document.querySelector(s);
function format(n){return n.toLocaleString('ru-RU');}

// ---------- инициализация ------------------------------------------
async function init(){
  products = await (await fetch('products.json')).json();
  filtered = [...products];
  fillFlowerSelect();
  renderList();
}
window.addEventListener('DOMContentLoaded',init);

// ---------- рендер карточек ----------------------------------------
function renderList(){
  const root = $('#list');
  root.innerHTML='';
  filtered.forEach(p=>{
    const d=document.createElement('div');
    d.className='card';
    d.innerHTML=`
      <img src="${p.image}" />
      <h4>${p.name}</h4>
      <small>${format(p.price)} ₽</small>
      <button data-id="${p.id}">🛒</button>`;
    d.querySelector('button').onclick=e=>addToCart(p.id);
    root.append(d);
  });
}

// ---------- фильтры -------------------------------------------------
$('#search').oninput = e=>{
  const q=e.target.value.toLowerCase();
  filtered = products.filter(p=>p.name.toLowerCase().includes(q));
  applyExtraFilters(); renderList();
};
$('#sort').onchange = applySort;
['#flt-color','#flt-occ','#price'].forEach(id=>$(id).onchange=applyExtraFilters);

function applyExtraFilters(){
  const col=$('#flt-color').value;
  const oc=$('#flt-occ').value;
  const max=+$('#price').value;
  $('#price-val').textContent=`≤ ${max} ₽`;

  filtered = filtered.filter(p=>
    (!col||p.color===col)&&(!oc||p.occasion===oc)&&p.price<=max
  );
}
function applySort(){
  const v=$('#sort').value;
  filtered.sort((a,b)=>{
    if(v==='name') return a.name.localeCompare(b.name);
    if(v==='price_asc') return a.price-b.price;
    if(v==='price_desc')return b.price-a.price;
  });
  renderList();
}

// ---------- корзина -------------------------------------------------
function addToCart(id,qty=1){
  const i=cart.findIndex(c=>c.id===id);
  i>-1?cart[i].qty+=qty:cart.push({id,qty});
  $('#cart-count').textContent=cart.reduce((s,i)=>s+i.qty,0);
}
$('#btn-cart').onclick=()=>showCart();
$('#cart-close').onclick=()=>$('#cart').close();

function showCart(){
  const block = $('#cart-items');
  block.innerHTML='';
  let sum=0;
  cart.forEach(item=>{
    const p=products.find(x=>x.id===item.id);
    const line=p.price*item.qty;
    sum+=line;
    const d=document.createElement('div');
    d.innerHTML=`${p.name} ×${item.qty}<b>${format(line)} ₽</b>`;
    block.append(d);
  });
  if(promoActive) sum*=.9;
  $('#cart-sum').textContent=format(sum);
  $('#cart').showModal();
}

// ---------- промокод + таймер --------------------------------------
$('#btn-promo').onclick=()=>{
  const code=$('#promo').value.trim().toLowerCase();
  if(code==='spring10'&&!promoActive){
     promoActive=true; $('#promo-ok').hidden=false;
     startTimer(900); showCart();
  }else alert('Неверный код.');
};
function startTimer(sec){
  const t=$('#timer'); t.hidden=false;
  const int=setInterval(()=>{
    const m=String(Math.floor(sec/60)).padStart(2,'0');
    const s=String(sec%60).padStart(2,'0');
    t.textContent=`Скидка действует ${m}:${s}`;
    if(--sec<0){clearInterval(int);promoActive=false;$('#promo-ok').hidden=true;t.hidden=true;showCart();}
  },1000);
}

// ---------- конструктор букета -------------------------------------
function fillFlowerSelect(){
  const sel=$('#flower');
  const unique = [...new Set(products.map(p=>p.name))];
  unique.forEach(n=>{
    sel.add(new Option(n,n));
  });
}
$('#add').onclick=()=>{
  const name=$('#flower').value;
  const pr=products.find(p=>p.name===name).price;
  const span=document.createElement('span');
  span.textContent=`${name} (${pr}₽)`;
  span.onclick=()=>span.remove(),updateSum();
  $('#stems').append(span); updateSum();
};
function updateSum(){
  let s=0;
  $('#stems').querySelectorAll('span').forEach(sp=>{
    const n=sp.textContent.match(/\((\d+)/)[1];
    s+=+n;
  });
  $('#sum').textContent=format(s);
}
$('#addToCart').onclick=()=>{
  addToCart(999,1); // id 999 = кастомный
  $('#builder').close();
};
$('#close').onclick=()=>$('#builder').close();

// ---------- мультиязычность ---------------------------------------
const i18n={ru:{title:"Blossom Boutique",cart:"Корзина"},en:{title:"Blossom Boutique",cart:"Cart"}};
$('#lang').onchange=e=>{
  const L=e.target.value;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent=i18n[L][el.dataset.i18n];
  });
};
const reviews = [
  {user:"Мария",text:"💐 Самые свежие цветы!"},
  {user:"Олег", text:"Быстрая доставка, спасибо!"}
];
const team = [
  {name:"Елена",role:"Флорист",photo:"avatars/elena.jpg"},
  {name:"Артём",role:"Курьер", photo:"avatars/artyom.jpg"}
];
const aboutRU = `
<h3>О Blossom Boutique</h3>
<p>Мы делаем букеты с 2005 года…</p>
`;

// ---------- вкладки ------------------------------------------------
document.querySelectorAll('#tabs button').forEach(btn=>{
  btn.onclick = ()=>switchTab(btn.dataset.tab);
});
function switchTab(id){
  document.querySelectorAll('main,#reviews,#viewer,#team,#about')
    .forEach(el=>el.classList.add('hidden'));
  (id==='list'?$('#list'):$('#'+id)).classList.remove('hidden');
}

// ---------- отзывы -------------------------------------------------
reviews.forEach(r=>{
  const div=document.createElement('div');
  div.className='review';
  div.innerHTML=`<b>${r.user}</b><br>${r.text}`;
  $('#rev-track').append(div);
});
let idx=0;
function showReview(i){
  $('#rev-track').style.transform=`translateX(${-i*100}%)`;
}
$('#prev').onclick=()=>{idx=(idx-1+reviews.length)%reviews.length;showReview(idx);}
$('#next').onclick=()=>{idx=(idx+1)%reviews.length;showReview(idx);}

// ---------- команда ------------------------------------------------
team.forEach(m=>{
  const d=document.createElement('div');
  d.className='staff-card';
  d.innerHTML=`<img src="${m.photo}"><br><b>${m.name}</b><br><small>${m.role}</small>`;
  $('#staff').append(d);
});

// ---------- страница About ----------------------------------------
$('#about').innerHTML = aboutRU;
