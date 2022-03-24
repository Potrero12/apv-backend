import { request, response } from "express";
import jwt from 'jsonwebtoken';

import Veterinario from "../models/Veterinario.js";

const checkOut = async (req = request, res = response, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_Secret_Word);
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");
            
            return next();

        } catch (error) {
                res.status(403).json({
                ok: false,
                msg: 'Token no valido'
            });
        }

    } 
    
    if(!token) {
        res.status(403).json({
            ok: false,
            msg: 'Token no valido o expirado'
        });
    }
    

    next();

}

export default checkOut;