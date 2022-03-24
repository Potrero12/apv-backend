import jwt from 'jsonwebtoken'

const generarJWT = (id) => {

    return jwt.sign({id}, process.env.JWT_Secret_Word, {
        expiresIn: "30d"
    });

}

export default generarJWT;