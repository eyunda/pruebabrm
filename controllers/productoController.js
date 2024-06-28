const db = require('../database/db')

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-11
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

exports.listarProductos = async (req, res) => {
    db.query('SELECT * FROM productos', (error, results) => {
        try {
            const productos = results.map(producto => ({
                ...producto,
                fechaIngreso: formatDate(producto.fechaIngreso)
            }));
            res.render('productos', { productos });
        } catch (error) {
            console.error('Error al listar productos:', error);
            res.status(500).send('Error al listar productos');
        }
    });
};


exports.crearProducto = async (req, res) => {
    const { numeroLote, nombre, precio, cantidadDisponible, fechaIngreso } = req.body;
    db.query('INSERT INTO productos SET ?', {numeroLote:numeroLote, nombre: nombre, precio:precio, cantidadDisponible:cantidadDisponible, fechaIngreso:fechaIngreso}, (error, results)=>{
        try {
            res.redirect('/productos');
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(500).send('Error al crear producto');
        }

    })
};

exports.obtenerProducto = async (req, res) => {
    db.query('SELECT * FROM productos WHERE id = ?', [req.params.id], async (error, results)=>{
        try {
            res.render('productodetail', { producto: results[0] });
        } catch (error) {
            console.error('Error al crear producto:', error);
            res.status(404).send('Producto no encontrado');
        }
    })
};

exports.actualizarProducto = async (req, res) => {
    const { numeroLote, nombre, precio, cantidadDisponible, fechaIngreso } = req.body;
    db.query('UPDATE productos SET numeroLote = ?, nombre = ?, precio = ?, cantidadDisponible = ?, fechaIngreso = ? WHERE id = ?', [numeroLote, nombre, precio, cantidadDisponible, fechaIngreso, req.params.id], (error, results)=>{
        try {
            res.redirect('/productos');
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).send('Error al actualizar producto');
        }

    })
};

exports.eliminarProducto = async (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], async (error, results)=>{
        try {
            res.redirect('/productos');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        res.status(404).send('Error al eliminar producto');
        }
    })
};
