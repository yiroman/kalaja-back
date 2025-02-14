const nodemailer = require("nodemailer");

const enviarCorreo = async (correo, body) => {
    const transporter = nodemailer.createTransport({
        host: 'mta.tlaxcala.gob.mx',
        port: 465,
        secure: true, // Usar SSL
        auth: {
            user: 'omg.noreply@tlaxcala.gob.mx',
            pass: 'HolaMundo$1.'
        },
        tls: {
            rejectUnauthorized: false // Opciones SSL/TLS equivalentes a PHP
        }
    });
    const info = await transporter.sendMail({
        from: '"Notificaciones OMG" <omg.noreply@tlaxcala.gob.mx>', // Remitente
        to: correo, // Destinatario
        subject: 'Notificación de SIPRAMERT', // Asunto
        text: `Hola adminsitrador, este es un mensaje de prueba.`, // Texto plano
        html: `${body}` // HTML del mensaje
    });
}

const enviarCorreoComentario = async (correo, body) => {
    const transporter = nodemailer.createTransport({
        host: 'mta.tlaxcala.gob.mx',
        port: 465,
        secure: true, // Usar SSL
        auth: {
            user: 'omg.noreply@tlaxcala.gob.mx',
            pass: 'HolaMundo$1.'
        },
        tls: {
            rejectUnauthorized: false // Opciones SSL/TLS equivalentes a PHP
        }
    });
    const info = await transporter.sendMail({
        from: '"Notificaciones OMG" <omg.noreply@tlaxcala.gob.mx>', // Remitente
        to: correo, // Destinatario
        subject: 'Notificación de SIPRAMERT', // Asunto
        text: `Hola adminsitrador, este es un mensaje de prueba.`, // Texto plano
        html: `${body}` // HTML del mensaje
    });
}

module.exports = { enviarCorreo }