const express = require('express');
const router = express.Router();
const  Reservation  = require('../models/Reservation');
const Passenger = require('../models/Passenger');

// Crear múltiples pasajeros
router.post('/', async (req, res) => {
    const { passengers, reservationId } = req.body;

    // Validar que la reservación exista
    try {
        const reservation = await Reservation.findByPk(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error checking reservation' });
    }

    // Crear los pasajeros
    try {
        const createdPassengers = await Passenger.bulkCreate(
            passengers.map((passenger) => ({
                ...passenger,
                reservationId,
            }))
        );
        res.status(201).json({ message: 'Passengers created successfully', passengers: createdPassengers });
    } catch (error) {
        res.status(400).json({ error: 'Error creating passengers', details: error.message });
    }
});

module.exports = router;
