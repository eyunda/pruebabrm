const db = require('../database/db')

// Mostrar carrito de compras
exports.mostrarCarrito = async (req, res) => {
    try {
        const query = 'SELECT c.*, p.nombre AS nombre_producto, p.precio FROM compras c JOIN productos p ON c.productoId = p.id WHERE c.estado = 1';
        db.query(query, (error, results) => {
            if (error) throw error;
            res.render('carrito', { compras: results });
        });
    } catch (error) {
        console.error('Error al mostrar carrito de compras:', error);
        res.status(500).send('Error interno al mostrar carrito de compras');
    }
};

// Mostrar formulario para editar compra
exports.mostrarFormularioEditar = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de la compra a editar
        const query = `
            SELECT c.*, p.nombre AS nombre_producto, p.precio 
            FROM compras c 
            JOIN productos p ON c.productoId = p.id 
            WHERE c.id = ?
        `;
        db.query(query, [id], (error, results) => {
            if (error) throw error;
            res.render('editar-compra', { compras: results });
        });
    } catch (error) {
        console.error('Error al mostrar formulario de edición:', error);
        res.status(500).send('Error interno al mostrar formulario de edición');
    }
};

// Actualizar cantidad de la compra
exports.actualizarCompra = async (req, res) => {
    try {
        const { compras } = req.body;
        db.query('UPDATE compras SET cantidad = ? WHERE id = ?', [compras[0].cantidad, compras[0].id], (error, results)=>{
        try {
            res.redirect('/compras');
        } catch (error) {
            console.error('Error al actualizar cantidad de compras:', error);
            res.status(500).json({ error: 'Error interno al actualizar cantidad de compras' });
        }

    })
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno al procesar la solicitud' });
    }
};


// Agregar productos al carrito de compras
exports.agregarAlCarrito = async (req, res) => {
    const productos = req.body.productos;
    try {
        const productosValidos = productos.filter(producto => parseInt(producto.cantidad) > 0);
        if (productosValidos.length > 0) {
            const insertValues = productosValidos.map(producto => [producto.id, parseInt(producto.cantidad), 1]);
            db.query('INSERT INTO compras (productoId, cantidad, estado) VALUES ?', [insertValues], (error, results) => {
                if (error) {
                    console.error('Error al agregar productos al carrito:', error);
                    res.status(500).json({ error: 'Error interno al agregar productos al carrito' });
                } else {
                    res.redirect('/compras');
                }
            });
        } else {
            res.status(400).json({ error: 'Al menos un producto debe tener cantidad mayor que 0' });
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno al procesar la solicitud' });
    }
};



exports.obtenerTodosLosProductos = async () => {
    try {
        const query = 'SELECT * FROM productos';
        db.query(query, (error, results) => {
            if (error) throw error;
            res.render('carrito', { compras: results });
        });
    } catch (error) {
        console.error('Error al mostrar carrito de compras:', error);
        res.status(500).send('Error interno al mostrar carrito de compras');
    } 
};

exports.actualizarEstado = async (req, res) => {
    try {
      const { compras } = req.body;
      const nuevoEstado = 2;
  
      const query = `UPDATE compras SET estado = ${nuevoEstado} WHERE id IN (${compras.join(',')})`;
      db.query(query, (error, results) => {
        if (error) {
          console.error('Error al actualizar estados de compras:', error);
          return res.status(500).json({ error: 'Error interno al actualizar estados de compras' });
        }
        res.redirect('/compras');
      });
    } catch (error) {
      console.error('Error al actualizar estados de compras:', error);
      res.status(500).json({ error: 'Error interno al actualizar estados de compras' });
    }
  };
