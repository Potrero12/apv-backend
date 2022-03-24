import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

//accion o trigger antes de guardar un veterinario
veterinarioSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }

    //encryptar la contraseña
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    this.password = await bcrypt.hashSync(this.password, salt);
});

//comparar las contraseñas si son iguales
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){

    return await bcrypt.compareSync(passwordFormulario, this.password);

}

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;