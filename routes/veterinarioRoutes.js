import { Router } from 'express';
const router = Router();

import { 
    perfil,
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkOut from '../middlewares/authMiddleware.js';


//area publica
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
//generar una nueva contraseña
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);
// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);


//area privada
router.get('/perfil', checkOut, perfil);
router.put('/perfil/:id', checkOut, actualizarPerfil)
router.put('/actualizar-password', checkOut, actualizarPassword)

export default router;