function qs(name){
  return new URLSearchParams(window.location.search).get(name)
}
const id = Number(qs('id'))
const p = products.find(x=>x.id===id)
if(!p){document.body.innerHTML = '<p>Sản phẩm không tìm thấy. <a href="index.html">Về trang chính</a></p>'}
else{
  document.getElementById('pdImg').src = p.img
  document.getElementById('pdImg').alt = p.title
  document.getElementById('pdTitle').textContent = p.title
  document.getElementById('pdPrice').textContent = new Intl.NumberFormat('vi-VN').format(p.price) + '₫'
  document.getElementById('pdDesc').textContent = p.desc || ''
  document.getElementById('pdAdd').addEventListener('click', ()=>{
    // simple local-cart stored in localStorage
    const cart = JSON.parse(localStorage.getItem('cart')||'{}')
    cart[id] = (cart[id]||0)+1
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Đã thêm vào giỏ')
  })
}
