// FlightClass model
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const FlightClass = sequelize.define('FlightClass', {
    className: {
        type: DataTypes.ENUM('Economy', 'Tourist', 'First'),
        allowNull: false,
    },
    classPrice: {
        type: DataTypes.DECIMAL(10, 2), // Asegúrate de que sea tipo decimal
        allowNull: false,
    },
});

module.exports = FlightClass;
