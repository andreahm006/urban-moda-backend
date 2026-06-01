const form = document.getElementById('productForm');
const table = document.getElementById('adminTable');
const initialProducts = [
  { name: 'Camisa urbana blanca', category: 'camisas', price: 75000 },
  { name: 'Pantalón cargo negro', category: 'pantalones', price: 120000 }
];
function getAdminProducts() {
  return JSON.parse(localStorage.getItem('urbanModaAdminProducts')) || initialProducts;
}
function saveAdminProducts(products) {
  localStorage.setItem('urbanModaAdminProducts', JSON.stringify(products));
}
function renderTable() {
  const products = getAdminProducts();
  table.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.category}</td><td>${formatPrice(p.price)}</td>`;
    table.appendChild(tr);
  });
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const products = getAdminProducts();
  products.push({
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    price: document.getElementById('productPrice').value
  });
  saveAdminProducts(products);
  form.reset();
  renderTable();
  alert('Producto registrado correctamente');
});
renderTable();
