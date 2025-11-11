// product-list.js
// Renders products from data.js into a grid and handles "Xem thêm" (Load More)
(function(){
  const grid = document.getElementById('productGrid')
  const loadBtn = document.getElementById('loadMore')
  const catContainer = document.getElementById('categoryFilters')
  const viewAllBtn = document.getElementById('viewAllBtn')
  if(!grid) return

  const PER_PAGE = 12
  let shown = 0
  let activeCat = null

  function fmtPrice(n){
    return new Intl.NumberFormat('vi-VN').format(n) + '₫'
  }

  function makeCard(p){
    // Use the same card layout as Trangchu so styles and event handlers (add-to-cart, quick-view) work
    const div = document.createElement('div')
    div.className = 'card'
    div.setAttribute('data-id', p.id)
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="prod-img" loading="lazy">
      <div class="title">${p.title}</div>
      <div class="price">${fmtPrice(p.price)}</div>
      <div style="margin-top:auto;display:flex;gap:8px">
        <button class="btn primary" data-id="${p.id}">Thêm vào giỏ</button>
        <button class="btn secondary qview" data-id="${p.id}">Xem nhanh</button>
      </div>
    `
    // graceful image fallback to .svg if raster missing
    const imgEl = div.querySelector('img')
    if(imgEl){
      imgEl.onerror = function(){ try{ this.src = this.src.replace(/\.(jpe?g|png|webp)$/i, '.svg') }catch(e){} }
    }
    return div
  }

  function getSourceList(){
    return (window.products || []).filter(p => !activeCat || p.cat === activeCat)
  }

  function clearGrid(){
    grid.innerHTML = ''
  }

  function renderNext(){
    const list = getSourceList()
    const next = list.slice(shown, shown + PER_PAGE)
    next.forEach(p => grid.appendChild(makeCard(p)))
    shown += next.length
    if(shown >= list.length){
      if(loadBtn) loadBtn.style.display = 'none'
    } else {
      if(loadBtn) loadBtn.style.display = ''
    }
  }

  function renderAllFromStart(){
    shown = 0
    clearGrid()
    renderNext()
  }

  function buildCategoryButtons(){
    if(!catContainer) return
    const cats = Array.from(new Set((window.products||[]).map(p=>p.cat).filter(Boolean)))
    catContainer.innerHTML = ''
    cats.forEach(c=>{
      const btn = document.createElement('button')
      btn.className = 'filter-btn'
      btn.textContent = c
      btn.dataset.cat = c
      btn.addEventListener('click', ()=>{
        // toggle
        if(activeCat === c){ activeCat = null } else { activeCat = c }
        // mark active class
        Array.from(catContainer.children).forEach(x=>x.classList.remove('active'))
        if(activeCat){
          Array.from(catContainer.children).forEach(x=>{ if(x.dataset.cat===activeCat) x.classList.add('active') })
        }
        renderAllFromStart()
      })
      catContainer.appendChild(btn)
    })
  }

  // initial render
  document.addEventListener('DOMContentLoaded', ()=>{
    if(window.products && Array.isArray(window.products)){
      buildCategoryButtons()
      // if a category was stored (from Trangchu), apply it
      try{
        const last = localStorage.getItem('lastCategory')
        if(last && last !== 'all'){
          activeCat = last
          // mark correct button active
          if(catContainer){
            Array.from(catContainer.children).forEach(x=>{ if(x.dataset && x.dataset.cat === activeCat) x.classList.add('active') })
          }
        }
      }catch(e){}
      renderAllFromStart()
      // clear the stored lastCategory so it doesn't persist
      try{ localStorage.removeItem('lastCategory') }catch(e){}
    } else {
      setTimeout(()=>{ if(window.products){ buildCategoryButtons(); renderAllFromStart() } }, 200)
    }
  })

  if(loadBtn) loadBtn.addEventListener('click', ()=>{ renderNext() })
  if(viewAllBtn) viewAllBtn.addEventListener('click', ()=>{ activeCat = null; Array.from(catContainer.children).forEach(x=>x.classList.remove('active')); renderAllFromStart() })

})();
