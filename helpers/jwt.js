const jwt = require('jsonwebtoken');
const { resolve } = require('path');

/*
    Creamos un token con un payload que contiene el uid y el name del usuario.
    Lo firma con una clave secreta y establece una expiración de 2h.
    Además, devuelve una promesa, resuelta con el token generado o la rechaza con un mensaje de error,
*/
const generarJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = {uid, name};

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        });
    });
}

module.exports = {
    generarJWT
}