function initDB(){
    const request = indexedDB.open('mi_colmena_db',1);

      request.onupgradeneeded = e => {
          const db = e.target.result;
              if(!db.objectStoreNames.contains('productos')){
                    db.createObjectStore('productos',{keyPath:'id',autoIncrement:true});
                        }
                            if(!db.objectStoreNames.contains('ventas')){
                                  db.createObjectStore('ventas',{keyPath:'id',autoIncrement:true});
                                      }
                                        };

                                          request.onsuccess = () => {
                                              document.body.innerHTML += "<p>✅ Base creada correctamente</p>";
                                                };

                                                  request.onerror = () => {
                                                      document.body.innerHTML += "<p>❌ Error al crear la base</p>";
                                                        };
                                                        }
                                                        
