const express = require('express');
const router = express.Router();
const db = require('../database/db')
const authController = require('../controllers/authController');
const productoController = require('../controllers/productoController');
const compraController = require('../controllers/compraController');
const facturaController = require('../controllers/facturaController');
const historialController = require('../controllers/historialController');

// Middleware para validar si el usuario es cliente
const esCliente = (req, res, next) => {
    if (req.user && req.user.rol === 'Cliente') {
        next();
    } else {
        res.render('acceso-denegado', { message: 'Acceso denegado. Esta acción está reservada para clientes.' });
    }
};

// Middleware para validar si el usuario es administrador
const esAdministrador = (req, res, next) => {
    if (req.user && req.user.rol === 'Administrador') {
        next();
    } else {
        res.status(403).render('acceso-denegado', { message: 'Acceso denegado. Esta acción está reservada para administradores.' });
    }
};

// Rutas para vistas generales
router.get('/index', authController.isAuthenticated, (req, res)=>{    
    res.render('index', {user:req.user})
});

router.get('/', authController.isAuthenticated, (req, res)=>{    
    res.render('index', {user:req.user})
});

router.get('/cliente', authController.isAuthenticated, esCliente, (req, res)=>{    
    res.render('cliente', {user:req.user})
});

// Rutas para productos
router.get('/productos', authController.isAuthenticated, esAdministrador, productoController.listarProductos);
router.get('/productos/crear', authController.isAuthenticated, esAdministrador, (req, res) => res.render('producto'));
router.post('/productos', authController.isAuthenticated, esAdministrador, productoController.crearProducto);
router.get('/productos/:id', authController.isAuthenticated, esAdministrador, productoController.obtenerProducto);
router.post('/productos/:id', authController.isAuthenticated, esAdministrador, productoController.actualizarProducto);
router.post('/productos/:id/eliminar', authController.isAuthenticated, esAdministrador, productoController.eliminarProducto);

// Rutas para compras
router.get('/compras', authController.isAuthenticated, esCliente, compraController.mostrarCarrito);
router.get('/compras/agregar', authController.isAuthenticated, esCliente, async (req, res) => {
    try {
        const query = 'SELECT * FROM productos';
        db.query(query, (error, results) => {
            if (error) throw error;
            res.render('carritocrear', { productos: results });
        });
    } catch (error) {
        console.error('Error al obtener productos para carrito de compras:', error);
        res.status(500).send('Error al obtener productos para carrito de compras');
    }
});
router.post('/compras/actualizar_estado', authController.isAuthenticated, esCliente, compraController.actualizarEstado);
router.post('/compras', authController.isAuthenticated, esCliente, compraController.agregarAlCarrito);

// Rutas para editar compra
router.get('/compras/editar/:id', authController.isAuthenticated, esCliente, compraController.mostrarFormularioEditar);
router.post('/compras/actualizar', authController.isAuthenticated, esCliente, compraController.actualizarCompra);


// Rutas para factura del día y historial de compras
router.get('/factura-dia', authController.isAuthenticated, esCliente, facturaController.visualizarFacturaDelDia);
router.get('/historial-compras', authController.isAuthenticated, esCliente, historialController.mostrarHistorialCompras);

// Rutas de autenticación
router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
});

router.get('/register', (req, res)=>{
    res.render('register')
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
