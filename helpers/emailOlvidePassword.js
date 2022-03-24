import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'marisol.schaden80@ethereal.email',
//         pass: 'P19mbfFvd7FFzZg5rm'
//     }
// });

  const { email, nombre, token } = datos;

  //Enviar el email

  const info = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Reestablecer tu password",
    text: "Reestablecer tu password",
    html: `<p>Hola: ${nombre}, ha solicitado reestablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONT_END_URL}/olvide-password/${token}">Reestablecer Password</a> </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;