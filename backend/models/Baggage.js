// Baggage model
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Baggage = sequelize.define('Baggage', {
    baggageType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    baggagePrice: {
        type: DataTypes.DECIMAL(10, 2), // Asegúrate de que sea tipo decimal
        allowNull: false,
    },
});

module.exports = Baggage;
