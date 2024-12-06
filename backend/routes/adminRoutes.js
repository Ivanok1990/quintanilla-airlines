const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Route = require('../models/Route');
const sequelize = require("../db/database");
const csrf = require('csurf');
const router = express.Router();

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../imagenes/perfiles')); // Carpeta donde se guardarán las fotos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
    },
});
const upload = multer({ storage });
const csrfProtection = csrf({ cookie: true });

// CRUD para Usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

router.post('/users', upload.single('profilePicture'), async (req, res) => {
    try {
        const { firstName, lastName, email, password, isadmin } = req.body;
        const profilePicture = req.file ? req.file.filename : null;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isadmin,
            profilePicture,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear usuario', details: err.message });
    }
});

router.put('/users/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        const { firstName, lastName, email, password, isadmin } = req.body;
        const profilePicture = req.file ? req.file.filename : user.profilePicture;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await user.update({ firstName, lastName, email, password: hashedPassword, isadmin, profilePicture });
        } else {
            await user.update({ firstName, lastName, email, isadmin, profilePicture });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar usuario', details: err.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        await user.destroy();
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// CRUD para Vuelos
router.get('/flights', async (req, res) => {
    try {
        const flights = await Flight.findAll({
            include: {
                model: Route,
                as: 'Route',
                attributes: ['origin', 'destination', 'duration'],
            },
        });
        res.json(flights);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener vuelos', details: err.message });
    }
});

router.post('/flights', async (req, res) => {
    try {
        const { flightNumber, departureTime, arrivalTime, price, seatsAvailable, routeId } = req.body;

        const route = await Route.findByPk(routeId);
        if (!route) {
            return res.status(400).json({ error: 'La ruta especificada no existe.' });
        }

        const flight = await Flight.create({
            flightNumber,
            departureTime,
            arrivalTime,
            price,
            seatsAvailable,
            routeId,
        });
        res.status(201).json(flight);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear vuelo', details: err.message });
    }
});

router.put('/flights/:id', async (req, res) => {
    try {
        const { flightNumber, departureTime, arrivalTime, price, seatsAvailable, routeId } = req.body;

        const flight = await Flight.findByPk(req.params.id);
        if (!flight) return res.status(404).json({ error: 'Vuelo no encontrado' });

        if (routeId) {
            const route = await Route.findByPk(routeId);
            if (!route) return res.status(400).json({ error: 'La ruta especificada no existe.' });
        }

        await flight.update({ flightNumber, departureTime, arrivalTime, price, seatsAvailable, routeId });
        res.json(flight);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar vuelo', details: err.message });
    }
});

router.delete('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) return res.status(404).json({ error: 'Vuelo no encontrado' });
        await flight.destroy();
        res.json({ message: 'Vuelo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar vuelo' });
    }
});

// CRUD para Rutas
router.get('/routes', async (req, res) => {
    try {
        const routes = await Route.findAll();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener rutas' });
    }
});

router.post('/routes', async (req, res) => {
    try {
        const route = await Route.create(req.body);
        res.status(201).json(route);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear ruta' });
    }
});

router.put('/routes/:id', async (req, res) => {
    try {
        const route = await Route.findByPk(req.params.id);
        if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });
        await route.update(req.body);
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar ruta' });
    }
});

router.delete('/routes/:id', async (req, res) => {
    try {
        const route = await Route.findByPk(req.params.id);
        if (!route) return res.status(404).json({ error: 'Ruta no encontrada' });
        await route.destroy();
        res.json({ message: 'Ruta eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar ruta' });
    }
});

// CRUD para Reservaciones
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: {
                model: Flight,
                as: 'ReservationFlight',
                attributes: ['flightNumber', 'departureTime', 'arrivalTime', 'price'],
            },
        });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservaciones', details: err.message });
    }
});

router.get('/reservations/:id',  async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: {
                model: Flight,
                as: 'ReservationFlight',
                attributes: ['flightNumber', 'departureTime', 'arrivalTime', 'price'],
            },
        });
        if (!reservation) return res.status(404).json({ error: 'Reservación no encontrada' });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservación', details: err.message });
    }
});

router.post('/reservations', async (req, res) => {
    try {
        const { reservationCode, flightId, payerFirstName, payerLastName, payerEmail, totalPrice, numberOfPassengers } = req.body;

        const reservation = await Reservation.create({
            reservationCode,
            flightId,
            payerFirstName,
            payerLastName,
            payerEmail,
            totalPrice,
            numberOfPassengers,
            reservationDate: new Date(),
        });
        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear reservación', details: err.message });
    }
});

router.put('/reservations/:id',  async (req, res) => {
    try {
        const { reservationCode, flightId, payerFirstName, payerLastName, payerEmail, totalPrice, numberOfPassengers } = req.body;

        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Reservación no encontrada' });

        await reservation.update({
            reservationCode,
            flightId,
            payerFirstName,
            payerLastName,
            payerEmail,
            totalPrice,
            numberOfPassengers,
        });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar reservación', details: err.message });
    }
});

router.delete('/reservations/:id',  async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).json({ error: 'Reservación no encontrada' });
        await reservation.destroy();
        res.json({ message: 'Reservación eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar reservación', details: err.message });
    }
});

// Vuelos populares
router.get('/flights/popular', async (req, res) => {
    try {
        const popularFlights = await Reservation.findAll({
            attributes: [
                'flightId',
                [sequelize.fn('COUNT', sequelize.col('flightId')), 'reservationCount'],
            ],
            include: {
                model: Flight,
                as: 'ReservationFlight',
                attributes: ['flightNumber'],
            },
            group: ['flightId', 'ReservationFlight.flightNumber'],
            order: [[sequelize.fn('COUNT', sequelize.col('flightId')), 'DESC']],
        });
        res.json(popularFlights);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener vuelos populares', details: err.message });
    }
});

module.exports = router;
