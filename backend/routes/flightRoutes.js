const express = require('express');
const Flight = require('../models/Flight');
const Route = require('../models/Route');
const router = express.Router();

// Ruta para obtener vuelos según los parámetros enviados
router.get('/', async (req, res) => {
    try {
        const { date, from, to } = req.query;

        // Validar parámetros de la solicitud
        if (!date || !from || !to) {
            return res.status(400).json({ message: 'Please provide date, from, and to parameters.' });
        }

        // Buscar vuelos que coincidan con el criterio
        const flights = await Flight.findAll({
            include: {
                model: Route,
                as: 'Route', // Alias definido en la asociación
                where: { origin: from, destination: to },
                attributes: ['origin', 'destination', 'duration'],
            },
        });

        // Verificar si no se encontraron vuelos
        if (!flights || flights.length === 0) {
            return res.status(404).json({ message: 'No flights found for the given criteria.' });
        }

        // Mapear datos para incluir origin y destination desde Route y ajustar fechas
        const flightsWithDetails = flights.map((flight) => {
            const departureDateTime = new Date(`${date}T${flight.departureTime}`);
            const arrivalDateTime = new Date(`${date}T${flight.arrivalTime}`);

            return {
                id: flight.id,
                flightNumber: flight.flightNumber,
                origin: flight.Route.origin, // Incluye 'origin' desde la relación Route
                destination: flight.Route.destination, // Incluye 'destination' desde la relación Route
                departureTime: departureDateTime, // Combina fecha seleccionada con hora del vuelo
                arrivalTime: arrivalDateTime, // Combina fecha seleccionada con hora del vuelo
                price: flight.price,
                seatsAvailable: flight.seatsAvailable,
                duration: flight.Route.duration, // Incluye la duración desde la relación Route
            };
        });

        // Enviar la respuesta con los datos procesados
        res.json(flightsWithDetails);
    } catch (error) {
        console.error('Error fetching flights:', error.message);
        res.status(500).json({ message: 'Error fetching flights', details: error.message });
    }
});

// Nueva ruta para obtener ubicaciones únicas (origen y destino)
router.get('/locations', async (req, res) => {
    try {
        // Obtener orígenes únicos
        const origins = await Route.findAll({
            attributes: ['origin'],
            group: ['origin'],
            raw: true,
        });

        // Obtener destinos únicos
        const destinations = await Route.findAll({
            attributes: ['destination'],
            group: ['destination'],
            raw: true,
        });

        res.json({
            origins: origins.map((o) => o.origin),
            destinations: destinations.map((d) => d.destination),
        });
    } catch (err) {
        console.error('Error al obtener ubicaciones:', err);
        res.status(500).json({ error: 'Error al obtener ubicaciones', details: err.message });
    }
});

module.exports = router;
