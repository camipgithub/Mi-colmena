function initDB(){
  const request = indexedDB.open('mi_colmena_db',1);
  request.onupgradeneeded = e => {
    const db = e.target.result;
    db.createObjectStore('productos',{keyPath:'id',autoIncrement:true});
    db.createObjectStore('ventas',{keyPath:'id',autoIncrement:true});
  };
  request.onsuccess = ()=>alert('Base creada correctamente');
}
