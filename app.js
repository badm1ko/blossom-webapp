/* === init === */
const tg = window.Telegram.WebApp;
tg.ready(); tg.expand();

/* --- i18n ---------------------------------------------------------- */
const tr = {
  ru:{add:'Добавить',total:'Итого',pay:'Оплатить',empty:'Пусто',discount:'Скидка'},
  en:{add:'Add',total:'Total',pay:'Pay',empty:'Empty',discount:'Discount'}
};
let lang = 'ru';
document.getElementById('lang').onchange = e => {lang=e.target.value; redraw()};

/* --- state --------------------------------------------------------- */
let products = [];       // все товары
let filtered = [];       // после фильтра
let cart      = [];      // [{id, qty}]
let promo     = null;    // {code, value}
let discountDeadline = null;

/* --- helpers ------------------------------------------------------- */
const $ = q => document.querySelector(q);
const format = n => new Intl.NumberFormat('ru-RU').format(n);

/* --- load products ------------------------------------------------- */
async function loadProducts(){
  // ⚠ замените на real API
  products = await (await fetch('products.json')).json();
  filtered = [...products];
  buildGrid();
}
loadProducts();

/* --- build card grid ---------------------------------------------- */
function buildGrid(){
  const grid = $('#grid'); grid.innerHTML='';
  filtered.forEach(p=>{
    const card = document.createElement('div');
    card.className='card'; card.dataset.id=p.id;
    card.innerHTML=`<img src="${p.image_url}"><h3>${p.name}</h3><p>${format(p.price)} ₽</p>`;
    card.onclick = () => openConfigurator(p);
    grid.append(card);
  });
}

/* --- filters ------------------------------------------------------- */
$('#priceRange').oninput = ()=>applyFilters();
$('#colorFilter').onchange = ()=>applyFilters();
$('#occasionFilter').onchange = ()=>applyFilters();

function applyFilters(){
  const maxPrice = +$('#priceRange').value;
  const color = $('#colorFilter').value;
  const occ   = $('#occasionFilter').value;

  filtered = products.filter(p=>{
    const okPrice = p.price<=maxPrice;
    const okColor = color==='all'||p.color===color;
    const okOcc   = occ==='all'  ||p.occasion===occ;
    return okPrice&&okColor&&okOcc;
  });
  buildGrid();
}

/* --- configurator drawer ------------------------------------------ */
function openConfigurator(prod){
  $('#drawerTitle').innerText=prod.name;
  $('#drawerBody').innerHTML=`
      <p>${prod.description || ''}</p>
      <label>Кол-во: <input id="qty" type="number" min="1" value="1"></label>`;
  $('#drawer').classList.remove('hidden');

  $('#addToCart').onclick = ()=>{
    const qty = +$('#qty').value||1;
    cart.push({id:prod.id,qty});
    updateCartCount();
    $('#drawer').classList.add('hidden');
  };
}

/* --- cart ---------------------------------------------------------- */
$('#cartBtn').onclick  = ()=>showCart();
$('#checkout').onclick = sendToBot;
$('#applyPromo').onclick = applyPromo;

function updateCartCount(){
  $('#cartCount').innerText = cart.reduce((s,i)=>s+i.qty,0);
}
function showCart(){
  const cartSec=$('#cart'); cartSec.classList.toggle('hidden');
  const list=$('#cartList'); list.innerHTML='';

  if(!cart.length){list.innerHTML=`<li>${tr[lang].empty}</li>`; return;}

  cart.forEach(it=>{
    const prod = products.find(p=>p.id===it.id);
    const li=document.createElement('li');
    li.innerText=`${prod.name} ×${it.qty} — ${format(prod.price*it.qty)} ₽`;
    list.append(li);
  });

  // скидка таймер
  if(!discountDeadline){
    discountDeadline = Date.now()+ 5*60*1000;   // 5 минут
    $('#discountTimer').classList.remove('hidden');
    tickTimer();
  }

  calcTotal();
}
/* таймер скидки */
function tickTimer(){
  const remain = discountDeadline - Date.now();
  if(remain<=0){ $('#discountTimer').classList.add('hidden'); return;}
  const m = String(Math.floor(remain/60000)).padStart(2,'0');
  const s = String(Math.floor(remain/1000)%60).padStart(2,'0');
  $('#discountTimer').innerText=`${tr[lang].discount}: 5% (${m}:${s})`;
  setTimeout(tickTimer,1000);
}
/* промокод */
function applyPromo(){
  const code = $('#promoInput').value.trim().toUpperCase();
  if(code==='FLOWER10'){ promo={code,value:10}; }
  calcTotal();
}
/* вычисление суммы */
function calcTotal(){
  let total = cart.reduce((s,i)=>{
    const p = products.find(p=>p.id===i.id); return s+p.price*i.qty;
  },0);
  if(discountDeadline && Date.now()<discountDeadline) total*=.95;
  if(promo) total*=1-promo.value/100;
  $('#total').innerText=`${tr[lang].total}: ${format(Math.round(total))} ₽`;
  $('#checkout').disabled=false;
}

/* --- AR preview ---------------------------------------------------- */
if(navigator.xr || navigator.userAgent.includes('ARCore')){
  $('#arBtn').classList.remove('hidden');
  $('#arBtn').onclick = ()=>alert('Открываем WebXR… (demo)');
}

/* --- отправка данных в бот ---------------------------------------- */
function sendToBot(){
  tg.sendData(JSON.stringify({cart,promo}));
  tg.close();
}

/* --- локализация текста ------------------------------------------- */
function redraw(){
  $('#checkout').innerText = tr[lang].pay;
  calcTotal();
}
