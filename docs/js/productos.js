const products = [
  { id: 1, name: 'Camisa urbana blanca', category: 'camisas', price: 75000, icon: '👕' },
  { id: 2, name: 'Pantalón cargo negro', category: 'pantalones', price: 120000, icon: '👖' },
  { id: 3, name: 'Buzo oversize beige', category: 'buzos', price: 98000, icon: '🧥' },
  { id: 4, name: 'Chaqueta denim', category: 'chaquetas', price: 145000, icon: '🧥' },
  { id: 5, name: 'Camisa estampada', category: 'camisas', price: 82000, icon: '👚' },
  { id: 6, name: 'Pantalón jogger', category: 'pantalones', price: 105000, icon: '👖' }
];
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
function renderProducts(list) {
  grid.innerHTML = '';
  list.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">${product.icon}</div>
      <h3>${product.name}</h3>
      <p>Categoría: ${product.category}</p>
      <p class="price">${formatPrice(product.price)}</p>
      <button class="btn primary" data-id="${product.id}">Agregar al carrito</button>
    `;
    grid.appendChild(card);
  });
  document.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}
function filterProducts() {
  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) && (category === 'todos' || p.category === category)
  );
  renderProducts(filtered);
}
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  alert('Producto agregado al carrito');
}
searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
renderProducts(products);
