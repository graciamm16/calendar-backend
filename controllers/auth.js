const {response} = require('express');
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

// Grabar un usuario en la BD
const crearUsuario = async(req, res = response) => {
    const {email, password} = req.body;

    try{
        // Validamos el usuario
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptamos la contraseña del usuario
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardamos el usuario en la colección de usuarios de la BD
        await usuario.save();

        // Generamos JWT (Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }
}

const loginUsuario = async(req, res = response) => {
    const {email, password} = req.body;

    try{
        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmamos contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generamos nuestro JWT (Json Web Token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }
}

const revalidarToken = async(req, res = response) => {
    const uid = req.uid;
    const name = req.name;

    // Generamos un nuevo JWT y lo devolvemos en la petición
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}