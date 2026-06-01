const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
function renderCart() {
  const cart = getCart();
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>No hay productos en el carrito.</p>';
  }
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `<span>${item.name}</span><strong>${formatPrice(item.price)}</strong>`;
    cartItems.appendChild(row);
  });
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
  cartTotal.textContent = formatPrice(total);
}
clearCartBtn.addEventListener('click', () => {
  saveCart([]);
  renderCart();
});
checkoutBtn.addEventListener('click', () => {
  alert('Compra simulada correctamente. Evidencia de flujo finalizado.');
  saveCart([]);
  renderCart();
});
renderCart();
