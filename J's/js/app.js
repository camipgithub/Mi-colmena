window.agregar = function () {
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;

  const lista = document.getElementById('lista');

  const li = document.createElement('li');
  li.textContent = `${nombre} — $${precio} — stock: ${stock}`;

  lista.appendChild(li);

  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('stock').value = '';
};
