import mongoose from 'mongoose';

const conectarDB = async() => {

    try {
    
        const db = await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });


        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Mongodb conectado en ${url}`);

    } catch (error) {
        console.log(error);
    }

}


export default conectarDB;