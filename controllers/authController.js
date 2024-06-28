const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const {promisify} = require('util')

//registro de usuarios
exports.register = async (req, res) => {    
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
        const rol = req.body.rol; // Captura el valor del campo 'rol' enviado desde el formulario
        let passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash, rol: rol }, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al registrar usuario');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }       
};

exports.login = async (req, res)=>{
    try {
        const user = req.body.user
        const pass = req.body.pass        

        if(!user || !pass ){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                }else{
                    //inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                   console.log("TOKEN: "+token+" para el USUARIO : "+user)

                   const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                   }
                   res.cookie('jwt', token, cookiesOptions)
                   req.user = results[0];
                    // Verificar el rol del usuario y establecer si es cliente o es administrador
                    if (req.user.rol === 'Cliente') {
                        res.render('login', {
                            alert: true,
                            alertTitle: "Conexión exitosa",
                            alertMessage: "¡LOGIN CORRECTO!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: 'cliente'
                       })
                    } else {
                        res.render('login', {
                            alert: true,
                            alertTitle: "Conexión exitosa",
                            alertMessage: "¡LOGIN CORRECTO!",
                            alertIcon:'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: 'index'
                       })
                    }
                    
                    }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) {
                    return next();
                }
                req.user = results[0];
                res.locals.rol = results[0].rol;
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login');
    }
};


exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/')
}