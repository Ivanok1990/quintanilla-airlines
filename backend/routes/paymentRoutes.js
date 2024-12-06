const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Simula una base de datos para almacenar reservaciones
const reservationsDB = [];

// Configuración de transporte para Nodemailer
const SMTP_CONFIG = {
    host: "mail.keiseruniversity.edu.ni",
    port: 587,
    secure: false,
    auth: {
        user: "se.student@keiseruniversity.edu.ni",
        pass: "35ChRz)$ieeg",
    },
};
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Ruta para procesar pagos y generar la reservación
router.post('/',  async (req, res) => {
    try {
        const { reservationId, paymentDetails } = req.body;

        // Generar un número de reservación único
        const orderNumber = `RES-${uuidv4().slice(0, 8).toUpperCase()}`;

        // Guardar la reservación en la "base de datos"
        const newReservation = {
            orderNumber,
            reservationId,
            paymentDetails
        };
        reservationsDB.push(newReservation);

        // Enviar correo de confirmación
        const mailOptions = {
            from: 'quintanillaairlines1@gmail.com',
            to: paymentDetails.email,
            subject: 'Confirmación de su Reservación',
            html: `
                <h1>Gracias por su compra</h1>
                <p>Estimado/a ${paymentDetails.firstName} ${paymentDetails.lastName},</p>
                <p>Su reservación ha sido procesada con éxito. A continuación, los detalles:</p>
                <ul>
                    <li><strong>Número de reservación:</strong> ${orderNumber}</li>
                    <li><strong>Nombre del titular:</strong> ${paymentDetails.firstName} ${paymentDetails.cardholderLastName}</li>
                </ul>
                <p>Gracias por elegir Quintanilla Airlines. ¡Buen viaje!</p>
            `
        };

        await transporter.sendMail(mailOptions);

        // Responder con el número de reservación
        res.status(201).json({ orderNumber });
    } catch (error) {
        console.error('Error procesando el pago:', error);
        res.status(500).json({ error: 'Error procesando el pago. Por favor, inténtelo nuevamente.' });
    }
});

module.exports = router;
