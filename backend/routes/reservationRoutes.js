const express = require('express');
const Reservation = require('../models/Reservation');
const sequelize = require("../db/database");
const {Flight} = require("../models/associations");


const router = express.Router();



// Obtener todas las reservas (sin autenticación)
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
    console.log('Reservation:', Reservation); // Esto debería mostrar la definición del modelo

});

// Crear una reserva (sin autenticación)
router.post('/', async (req, res) => {
    const {
        flightId,
        numberOfPassengers,
        totalPrice,
        payerFirstName,
        payerLastName,
        payerEmail,
    } = req.body;

    try {
        const reservationCode = `RES-${Math.floor(100000 + Math.random() * 900000)}`;
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Generar orderId automáticamente

        const newReservation = await Reservation.create({
            reservationCode,
            orderId, // Agregar el campo `orderId` generado
            flightId,
            numberOfPassengers,
            totalPrice,
            payerFirstName,
            payerLastName,
            payerEmail,
            status: 'Pending',
        });

        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        console.error('Error creating reservation:', error); // Log detallado
        res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
});

// Buscar una reserva por código de reservación
router.get('/:reservationCode', async (req, res) => {
    const { reservationCode } = req.params;

    try {
        const reservation = await Reservation.findOne({
            where: { reservationCode },
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservation', error: error.message });
    }
});



module.exports = router;
