const db = require('../database/db');

// Visualizar factura del día
exports.visualizarFacturaDelDia = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
        const fechaActual = hoy.toISOString().split('T')[0];
        const query = `
            SELECT c.*, p.nombre AS nombre_producto, p.precio 
            FROM compras c 
            JOIN productos p ON c.productoId = p.id 
            WHERE DATE(c.created_at) = ?
            AND c.estado = 2
            ORDER BY c.created_at DESC
            LIMIT 2
        `;
        
        db.query(query, [fechaActual], (error, results) => {
            if (error) throw error;

            let total = 0;
            results.forEach(compra => {
                total += compra.cantidad * compra.precio;
            });

            res.render('factura-dia', { compras: results, total });
        });
    } catch (error) {
        console.error('Error al visualizar factura del día:', error);
        res.status(500).send('Error interno al visualizar factura del día');
    }
};
