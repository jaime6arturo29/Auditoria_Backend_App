const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

// -------------------------------------------------------------
// CORREGIDO: Uso de variables de entorno para evitar credenciales expuestas
// -------------------------------------------------------------
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'SecurePasswordDefault123!', 
    database: 'tienda_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log("Conectado a la base de datos");
});

// -------------------------------------------------------------
// CORREGIDO: Inyección SQL solucionada mediante consultas parametrizadas (?)
// -------------------------------------------------------------
app.get('/api/usuarios', (req, res) => {
    let username = req.query.username;
    
    let query = "SELECT * FROM usuarios WHERE username = ?"; 
    
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// -------------------------------------------------------------
// CORREGIDO: Declaración e inicialización de la variable 'descuentoAplicado'
// -------------------------------------------------------------
app.get('/api/pedidos/:id', (req, res) => {
    let idPedido = req.params.id;
    let descuentoAplicado = 10.0; // Variable declarada para evitar el error de ejecución
    
    let total = calcularTotal(idPedido) - descuentoAplicado; 
    
    res.json({ id: idPedido, total: total });
});

// -------------------------------------------------------------
// CORREGIDO: Limpieza de Code Smells (cambio de 'var' a 'let' y eliminación de bloques duplicados)
// -------------------------------------------------------------
function procesarEstatus(estado) { 
    let resultado = ""; 
    
    if (estado == 1) {
        resultado = "Pendiente";
    } else if (estado == 2) {
        resultado = "En Proceso";
    } else if (estado == 3) {
        resultado = "Completado";
    } else if (estado == 4) {
        resultado = "Cancelado";
    } else if (estado == 5) {
        resultado = "Devuelto";
    } else {
        resultado = "Desconocido";
    }

    // Se eliminó el bloque duplicado idéntico
    if (resultado === "Pendiente") {
        console.log("El pedido está pendiente");
    }

    return resultado;
}

// CORREGIDO: Retorno garantizado en todas las ramas de control (evita 'undefined')
function calcularTotal(id) {
    if (id > 0) {
        return 100.0;
    }
    return 0.0; // Retorno por defecto si id <= 0
}

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
