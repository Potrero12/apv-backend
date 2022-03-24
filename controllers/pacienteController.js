import { response } from "express"
import Paciente from "../models/Paciente.js"

const obtenerPacientes = async(req, res = response) => {


    const pacientes = await Paciente.find()
                                    //where es la columna para filtrar
                                    .where('veterinario')
                                    .equals(req.veterinario);

    res.status(200).json(pacientes)

}

const agregarPacientes = async(req, res = response) => {

    const body = req.body;
    const { nombre, email, propietario, sintomas } = req.body;

    try {

        const paciente = new Paciente(body);
        paciente.veterinario = req.veterinario._id

        const pacienteGuardado = await paciente.save();

        
        res.status(200).json({
            ok: true,
            pacienteGuardado,
            msg: 'Paciente guardado correctamente'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }


}

const obtenerPaciente = async(req, res = response) => {

    const pacienteId = req.params.id;

    try {

        const paciente = await Paciente.findById(pacienteId);

        if(!paciente){
            return res.status(400).json({
                ok: false,
                msg: 'No Encontrado'
            })
        }

        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(404).json({
                ok: false,
                msg: 'Accion No Valida'
            });
        }
    
        res.status(200).json(paciente)

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const actualizarPaciente = async(req, res = response) => {

    const pacienteId = req.params.id;

    try {

        const paciente = await Paciente.findById(pacienteId);

        if(!paciente){
            return res.status(400).json({
                ok: false,
                msg: 'No Encontrado'
            })
        }

        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(404).json({
                ok: false,
                msg: 'Accion No Valida'
            });
        }

        //actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        const pacienteActualizado = await paciente.save();

        res.status(201).json({
            ok: true,
            pacienteActualizado,
            msg: 'Paciente Actualizado Correctamente'
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

const eliminarPaciente = async(req, res = response) => {

    const pacienteId = req.params.id;

    try {

        const paciente = await Paciente.findById(pacienteId);

        if(!paciente){
            return res.status(400).json({
                ok: false,
                msg: 'No Encontrado'
            })
        }

        if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
            return res.status(404).json({
                ok: false,
                msg: 'Accion No Valida'
            });
        }

        //eliminar registro
        const pacienteELiminado = await paciente.deleteOne();

        res.status(201).json({
            ok: true,
            pacienteELiminado,
            msg: 'Paciente Eliminado Correctamente'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error en la base de datos'
        })
    }

}

export {
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}