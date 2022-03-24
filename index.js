import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js'


const app = express();

//leer el body
app.use(express.json());

//leer variables de entorno
dotenv.config();

//conectar a la base de datos
conectarDB();


//cors
const dominiosPermitidos = [process.env.FRONT_END_URL];

const corsOptions = {
    origin: function (origin, callback) {
      if (dominiosPermitidos.indexOf(origin) !== -1) {
        // El Origen del Request esta permitido
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
  };
  
app.use(cors(corsOptions));

//rutas
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${process.env.PORT} `);
});
