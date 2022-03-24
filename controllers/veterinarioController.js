
import { response } from "express"
import Veterinario from '../models/Veterinario.js';  

import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
// import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
// import emailRegistro from "../helpers/emailRegistro.js";
  

const registrar = async (req, res = response) => {

    const { email, nombre } = req.body;

    try {

        //prevenir usuarios duplicados
        const existeUsuario = await Veterinario.findOne({email});

        if(existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Error!, El usuario ya existe'
            })
        }
        
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //enviar email - revisar porque no envia emails
        // emailRegistro({
        //     email,
        //     nombre,
        //     token: veterinarioGuardado.token
        // });

        res.status(200).json({
            ok: true,
            veterinarioGuardado,
            msg: 'Registrando usuario...'
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const perfil = (req, res = response) => {


    const { veterinario } = req;

    res.status(201).json(veterinario)

}

const actualizarPerfil = async(req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('hubo un error');
        return res.status(400).json({msg:error.message})
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email){
        const exiteEmail = await Veterinario.findOne({email})
        if(exiteEmail) {
            const error = new Error('Este Email Ya Esta En Uso');
            return res.status(400).json({msg:error.message})
        }
    }

    try {

        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save();

        res.status(200).json(veterinarioActualizado);
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const actualizarPassword = async(req, res) => {

    //leer datos
    const { id } = req.veterinario;
    const { password, passwordNueva } = req.body;

    //comprobar que existe le veterinario
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('hubo un error');
        return res.status(400).json({msg:error.message})
    }

    //comprobar password
    if(await veterinario.comprobarPassword(password)){
        //almacenar nuevo password
        
        veterinario.password = passwordNueva;
        await veterinario.save();
        res.status(201).json({msg: 'password almacenado correctamente'})

    } else {
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({msg:error.message})
    }


}

const confirmar = async(req, res) => {

    const { token } = req.params;

    try {

        const usuarioConfirmar = await Veterinario.findOne({token});
    
        if(!usuarioConfirmar) {
            return res.status(400).json({
                ok: false,
                msg: 'Error!, Usuario no encontrado'
            });
        }

        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
    
        res.status(200).json({
            ok: true,
            msg: 'Usuario Confirmado Correctamente'
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const autenticar = async(req, res) => {

    const { email, password } = req.body;

    try {

        //prevenir usuarios duplicados
        const existeUsuario = await Veterinario.findOne({email});

        if(!existeUsuario) {
            return res.status(403).json({
                ok: false,
                msg: 'Error!, Datos ingresados no son correctos'
            })
        }

        //comprobar si el usuario esta confirmado
        if(!existeUsuario.confirmado){
            return res.status(403).json({
                ok: false,
                msg: 'Error!,Usuario No confirmado'
            })
        }

        //revisar el password si es correcto
        if(await existeUsuario.comprobarPassword(password)){
            return res.status(200).json({
                ok: true,
                _id: existeUsuario._id,
                nombre: existeUsuario.nombre,
                email: existeUsuario.email,
                token: generarJWT(existeUsuario.id),
                msg: 'Datos correctos'
            });
        }else {
            const error = new Error("El Password es incorrecto");
            return res.status(403).json({ msg: error.message });
          }

        // const token = generarJWT(existeUsuario.id);

        //generar el token - JWT
        // res.status(201).json({
        //     ok: true,
        //     token
        // });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const olvidePassword = async(req, res) => {

    const { email } = req.body;

    try {

        const existeVeterinario = await Veterinario.findOne({email});

        if(!existeVeterinario){
            return res.status(403).json({
                ok: false,
                msg: 'Error!, Correo Invalido'
            })
        }


        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //enviar email con instrucciones
        // emailOlvidePassword({
        //     nombre: existeVeterinario.nombre,
        //     email,
        //     token: existeVeterinario.token
        // })

        res.status(201).json({
            ok: true,
            msg: 'Email enviado con instrucciones'
        });



        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const comprobarToken = async(req, res) => {

    const token = req.params.token;

    const tokenValido = await Veterinario.findOne({token});

    if(!tokenValido){
        return res.status(400).json({
            ok: false,
            msg: 'Token invalido'
        })
    }

    res.status(201).json({
        ok: true,
        msg: 'autenticado jeje'
    })



}

const nuevoPassword = async(req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    try {

        const veterinario = await Veterinario.findOne({token});
        if(!veterinario){
            res.status(404).json({
                ok: false,
                msg: 'Error!'
            })
        }

        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();

        res.status(201).json({
            ok: true,
            msg: 'Password Modificada Correctamente'
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }


}

export {
    registrar,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    confirmar,
    autenticar,
    olvidePassword,
    nuevoPassword,
    comprobarToken
}