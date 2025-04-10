const {response} = require('express');
const jwt = require('jsonwebtoken');

/*
    Tenemos un middleware de express que valida un token en las solicitudes HTTP.
    Si el token es válido, añade el uid y el name en la solicitud.
    Si no es válido o no está presente, responde con un mensaje de error y un estado 401.
*/
const validarJWT = (req, res = response, next) => {
    // Lo pedimos en x-token (headers)
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try{
        const {uid, name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
        
        req.uid = uid;
        req.name = name;
        
    } catch(error){
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
}

module.exports = {
    validarJWT
}