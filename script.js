// products array is provided by data.js (loaded before this script)
const productGrid = document.getElementById('productGrid')
const cartBtn = document.getElementById('cartBtn')
const cartCount = document.getElementById('cartCount')
const cartModal = document.getElementById('cartModal')
const cartList = document.getElementById('cartList')
const cartTotal = document.getElementById('cartTotal')
const closeCart = document.getElementById('closeCart')
const checkoutBtn = document.getElementById('checkoutBtn')

// load cart from localStorage so product page and home stay in sync
let cart = JSON.parse(localStorage.getItem('cart') || '{}')

function saveCart(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

function formatVND(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}

function renderProducts(filter='all'){
  productGrid.innerHTML = ''
  const list = products.filter(p => filter==='all' ? true : p.cat===filter)
  list.forEach(p => {
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="prod-img">
      <div class="title">${p.title}</div>
      <div class="price">${formatVND(p.price)}₫</div>
      <div style="margin-top:auto;display:flex;gap:8px"><button class="btn primary" data-id="${p.id}">Thêm vào giỏ</button><button class="btn secondary qview" data-id="${p.id}">Xem nhanh</button></div>
    `
    productGrid.appendChild(card)
  })
}

function updateCartCount(){
  const qty = Object.values(cart).reduce((s,v)=>s+v,0)
  cartCount.textContent = qty
}

function openCart(){
  cartModal.style.display='flex'
  cartModal.setAttribute('aria-hidden','false')
  renderCart()
}
function closeCartPanel(){
  cartModal.style.display='none'
  cartModal.setAttribute('aria-hidden','true')
}

function renderCart(){
  cartList.innerHTML = ''
  let total = 0
  for(const id in cart){
    const p = products.find(x=>x.id==id)
    const qty = cart[id]
    total += p.price * qty
    const li = document.createElement('li')
    li.innerHTML = `<div style="flex:1">${p.title} <div style='color:#888;font-size:13px'>x${qty}</div></div><div style='font-weight:700'>${formatVND(p.price*qty)}₫</div>`
    cartList.appendChild(li)
  }
  cartTotal.textContent = formatVND(total)
}

// add listeners
// add-to-cart buttons (only buttons marked primary)
productGrid.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.primary[data-id]')
  if(!btn) return
  const id = btn.getAttribute('data-id')
  cart[id] = (cart[id]||0) + 1
  saveCart()
  updateCartCount()
})

// quick-view modal
const quickView = document.getElementById('quickView')
const qClose = document.getElementById('qClose')
const qImg = document.getElementById('qImg')
const qTitle = document.getElementById('qTitle')
const qPrice = document.getElementById('qPrice')
const qDesc = document.getElementById('qDesc')
const qAdd = document.getElementById('qAdd')
const qDetail = document.getElementById('qDetail')

productGrid.addEventListener('click', (e)=>{
  const qbtn = e.target.closest('button.qview')
  if(!qbtn) return
  const id = Number(qbtn.getAttribute('data-id'))
  const p = products.find(x=>x.id===id)
  if(!p) return
  qImg.src = p.img
  qImg.alt = p.title
  qTitle.textContent = p.title
  qPrice.textContent = formatVND(p.price) + '₫'
  qDesc.textContent = p.desc || ''
  qAdd.onclick = ()=>{ cart[id] = (cart[id]||0)+1; saveCart(); updateCartCount(); renderCart(); }
  qDetail.href = 'product.html?id=' + id
  quickView.style.display = 'flex'
}
)
qClose.addEventListener('click', ()=> quickView.style.display='none')

cartBtn.addEventListener('click', openCart)
closeCart.addEventListener('click', closeCartPanel)
checkoutBtn.addEventListener('click', ()=>{
  alert('Thanh toán tạm (demo) - Tổng: ' + cartTotal.textContent + '₫')
  cart = {}
  saveCart()
  updateCartCount()
  renderCart()
  closeCartPanel()
})

// filter buttons
Array.from(document.querySelectorAll('.filter-btn')).forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'))
    btn.classList.add('active')
    const cat = btn.getAttribute('data-cat')
    renderProducts(cat)
  })
})

// search
const searchInput = document.getElementById('searchInput')
const searchForm = document.querySelector('.search-form')
searchForm.addEventListener('submit', ()=>{
  const q = searchInput.value.trim().toLowerCase()
  productGrid.innerHTML = ''
  const list = products.filter(p => p.title.toLowerCase().includes(q))
  list.forEach(p=>{
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `\n      <div class="thumb">${p.title.split(' ')[0]}</div>\n      <div class="title">${p.title}</div>\n      <div class="price">${formatVND(p.price)}₫</div>\n      <div style="margin-top:auto"><button class="btn primary" data-id="${p.id}">Thêm vào giỏ</button></div>\n    `
    productGrid.appendChild(card)
  })
})

// initialize
renderProducts()
updateCartCount()

// listen to localStorage changes so multiple tabs/pages stay in sync
window.addEventListener('storage', (e)=>{
  if(e.key === 'cart'){
    try{ cart = JSON.parse(e.newValue || '{}') }catch(err){ cart = {} }
    updateCartCount()
    // if cart modal is open, re-render it
    if(cartModal.style.display === 'flex') renderCart()
  }
})
