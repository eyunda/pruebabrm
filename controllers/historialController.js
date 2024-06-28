const db = require('../database/db');

// Mostrar historial de productos comprados
exports.mostrarHistorialCompras = async (req, res) => {
    try {
        const query = 'SELECT c.*, p.nombre AS nombre_producto, p.precio FROM compras c JOIN productos p ON c.productoId = p.id WHERE c.estado = 2';
        db.query(query, (error, results) => {
            if (error) throw error;

            const historialAgrupado = results.reduce((acc, compra) => {
                const fechaHoraLocal = new Date(compra.created_at).toLocaleString("en-US", { timeZone: "America/Bogota" }); // Zona horaria de Colombia
                if (!acc[fechaHoraLocal]) {
                    acc[fechaHoraLocal] = [];
                }
                acc[fechaHoraLocal].push(compra);
                return acc;
            }, {});

            res.render('historial-compras', { historialAgrupado });
        });
    } catch (error) {
        console.error('Error al mostrar historial de compras:', error);
        res.status(500).send('Error interno al mostrar historial de compras');
    }
};
