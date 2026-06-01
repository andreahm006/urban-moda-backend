const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}
function formatPrice(value) {
  return '$ ' + Number(value || 0).toLocaleString('es-CO');
}
function getCart() {
  return JSON.parse(localStorage.getItem('urbanModaCart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('urbanModaCart', JSON.stringify(cart));
}
