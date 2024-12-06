// models/Flight.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Flight = sequelize.define('Flight', {
    flightNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    departureTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    arrivalTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    seatsAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    routeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Routes',
            key: 'id'
        }
    }
}, {
    timestamps: false // Desactiva createdAt y updatedAt
});

module.exports = Flight;
