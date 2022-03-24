import { Router } from 'express';
const route = Router();

import { 
    agregarPacientes, 
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';
import checkOut from '../middlewares/authMiddleware.js';


route.route('/')
    .post(checkOut, agregarPacientes)
    .get(checkOut, obtenerPacientes)
    
route.route('/:id')
     .get(checkOut, obtenerPaciente)
     .put(checkOut, actualizarPaciente)
     .delete(checkOut, eliminarPaciente)

export default route;