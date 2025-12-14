const DB_NAME = "mi_colmena_db";
const DB_VERSION = 1;

// Inicializar base
function initDB() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("productos")) {
      db.createObjectStore("productos", {
        keyPath: "id",
        autoIncrement: true
      });
    }
  };

  request.onsuccess = () => {
    listarProductos();
    alert("Base lista");
  };

  request.onerror = () => {
    alert("Error al crear la base");
  };
}

// Guardar producto
function guardarProducto() {
  const nombre = document.getElementById("nombre").value;
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);

  if (!nombre) {
    alert("Ingresá un producto");
    return;
  }

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("productos", "readwrite");
    const store = tx.objectStore("productos");

    store.add({ nombre, precio, stock });

    tx.oncomplete = () => {
      document.getElementById("nombre").value = "";
      document.getElementById("precio").value = "";
      document.getElementById("stock").value = "";
      listarProductos();
    };
  };
}

// Listar productos
function listarProductos() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onsuccess = (e) => {
    const db = e.target.result;
    const tx = db.transaction("productos", "readonly");
    const store = tx.objectStore("productos");

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        const p = cursor.value;
        const li = document.createElement("li");
        li.textContent = `${p.nombre} — $${p.precio} — stock: ${p.stock}`;
        lista.appendChild(li);
        cursor.continue();
      }
    };
  };
}
  
