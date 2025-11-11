// sanpham20.js — render up to 20 product cards, allow quick filtering and add-to-cart
console.log('sanpham20.js loaded')
console.log('window.products available?', typeof window.products !== 'undefined')
console.log('products count:', (window.products || []).length)

// Wait a bit then run
setTimeout(function(){
  console.log('sanpham20: timeout - running init')
  const grid = document.getElementById('grid20')
  console.log('grid element:', grid)
  
  if(!grid){ 
    console.error('sanpham20: grid20 not found')
    return 
  }
  
  if(!window.products || window.products.length === 0){
    console.error('sanpham20: products array is empty or undefined')
    return
  }

  const filterBtns = Array.from(document.querySelectorAll('.spFilter'))
  const btnAll = document.getElementById('sp20All')
  
  console.log('filterBtns:', filterBtns.length)
  console.log('btnAll:', btnAll)

  function fmt(n){ 
    return new Intl.NumberFormat('vi-VN').format(n) + '₫' 
  }

  function makeCard(p){
    const card = document.createElement('div')
    card.className = 'card'
    card.setAttribute('data-id', p.id)
    card.setAttribute('data-cat', p.cat)
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="prod-img">
      <div class="title">${p.title}</div>
      <div class="price">${fmt(p.price)}</div>
      <div style="margin-top:auto;display:flex;gap:8px">
        <button class="btn secondary qview" data-id="${p.id}">Xem nhanh</button>
        <button class="btn primary" data-id="${p.id}">Thêm vào giỏ</button>
      </div>
    `
    const img = card.querySelector('img')
    if(img) img.onerror = function(){ try{ this.src = this.src.replace(/\.(jpe?g|png|webp)$/i, '.svg') }catch(e){} }
    return card
  }

  function render(list){
    console.log('render called with', list.length, 'items')
    grid.innerHTML = ''
    list.forEach(p => {
      try {
        grid.appendChild(makeCard(p))
      } catch(e) {
        console.error('error making card:', e, p)
      }
    })
    console.log('rendered', grid.children.length, 'cards')
  }

  function showByCategory(cat){
    const filtered = window.products.filter(p => p.cat === cat)
    console.log('filtered by cat', cat, ':', filtered.length, 'items')
    const list = filtered.slice(0, 20)
    if(list.length > 0) {
      render(list)
    } else {
      render(window.products.slice(0, 20))
    }
  }

  // handle add-to-cart
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button.primary[data-id]')
    if(!btn) return
    const id = String(btn.getAttribute('data-id'))
    try{
      const cart = JSON.parse(localStorage.getItem('cart')||'{}')
      cart[id] = (cart[id]||0) + 1
      localStorage.setItem('cart', JSON.stringify(cart))
      const old = btn.textContent
      btn.textContent = 'Đã thêm'
      setTimeout(() => btn.textContent = old, 1000)
    }catch(e){ 
      console.error('cart error:', e)
      alert('Không thể thêm vào giỏ')
    }
  })

  // quick filters
  filterBtns.forEach(b => {
    b.addEventListener('click', () => {
      const cat = b.getAttribute('data-cat')
      console.log('filter clicked:', cat)
      showByCategory(cat)
    })
  })

  if(btnAll){
    btnAll.addEventListener('click', () => {
      console.log('Tất cả clicked')
      render(window.products.slice(0, 20))
    })
  }

  // initial render
  console.log('initial render - showing first 20')
  render(window.products.slice(0, 20))
  
}, 100);
