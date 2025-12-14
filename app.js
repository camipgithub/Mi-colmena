const DB_NAME = "mi_colmena_db";
const DB_VERSION = 2;

let db;

/* ================== INIT DB ================== */
function initDB() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    db = e.target.result;

    if (!db.objectStoreNames.contains("productos")) {
      db.createObjectStore("productos", {
        keyPath: "id",
        autoIncrement: true
      });
    }

    if (!db.objectStoreNames.contains("ventas")) {
      db.createObjectStore("ventas", {
        keyPath: "id",
        autoIncrement: true
      });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
    alert("Base inicializada ✔️");
    cargarProductos();
    cargarVentas();
  };

  request.onerror = () => {
    alert("Error al abrir la base");
  };
}

/* ================== INVENTARIO ================== */
function guardarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);

  if (!nombre || precio <= 0 || stock < 0) {
    alert("Datos inválidos");
    return;
  }

  const tx = db.transaction("productos", "readwrite");
  const store = tx.objectStore("productos");

  store.add({ nombre, precio, stock });

  tx.oncomplete = () => {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    cargarProductos();
  };
}

function cargarProductos() {
  const lista = document.getElementById("lista");
  const select = document.getElementById("productoVenta");

  lista.innerHTML = "";
  select.innerHTML = "";

  const tx = db.transaction("productos", "readonly");
  const store = tx.objectStore("productos");

  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const p = cursor.value;

      // Inventario
      const li = document.createElement("li");
      li.textContent = `${p.nombre} | $${p.precio} | Stock: ${p.stock}`;
      lista.appendChild(li);

      // Select venta
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.nombre;
      select.appendChild(opt);

      cursor.continue();
    }
  };
}

/* ================== VENTAS ================== */
function registrarVenta() {
  const productoId = Number(document.getElementById("productoVenta").value);
  const cantidad = Number(document.getElementById("cantidadVenta").value);
  const pago = document.getElementById("pago").value;

  if (cantidad <= 0) {
    alert("Cantidad inválida");
    return;
  }

  const tx = db.transaction(["productos", "ventas"], "readwrite");
  const prodStore = tx.objectStore("productos");
  const ventaStore = tx.objectStore("ventas");

  const req = prodStore.get(productoId);

  req.onsuccess = () => {
    const producto = req.result;

    if (!producto || producto.stock < cantidad) {
      alert("Stock insuficiente");
      return;
    }

    producto.stock -= cantidad;
    prodStore.put(producto);

    ventaStore.add({
      producto: producto.nombre,
      cantidad,
      total: producto.precio * cantidad,
      pago,
      fecha: new Date().toLocaleString()
    });
  };

  tx.oncomplete = () => {
    cargarProductos();
    cargarVentas();
  };
}

function cargarVentas() {
  const ul = document.getElementById("ventas");
  ul.innerHTML = "";

  const tx = db.transaction("ventas", "readonly");
  const store = tx.objectStore("ventas");

  store.openCursor().onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      const v = cursor.value;
      const li = document.createElement("li");
      li.textContent = `${v.fecha} | ${v.producto} x${v.cantidad} | $${v.total} | ${v.pago}`;
      ul.appendChild(li);
      cursor.continue();
    }
  };
    }
                                         
