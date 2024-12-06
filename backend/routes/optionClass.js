const express = require('express');
const FlightClasses = require('../models/FlightClass');
const Baggage = require('../models/Baggage');
const router = express.Router();

router.get('/flight-classes', async (req, res) => {
    try {
        const classes = await FlightClasses.findAll({
            attributes: ['id', 'className', 'classPrice']
        });
        res.json(classes);
    } catch (error) {
        console.error('Error fetching flight classes:', error);
        res.status(500).json({ message: 'Error fetching flight classes', error });
    }
});

router.get('/baggage', async (req, res) => {
    try {
        const baggageOptions = await Baggage.findAll({
            attributes: ['id', 'baggageType', 'baggagePrice']
        });
        res.json(baggageOptions);
    } catch (error) {
        console.error('Error fetching baggage options:', error);
        res.status(500).json({ message: 'Error fetching baggage options', error });
    }
});

module.exports = router;
