const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Flight = require('./Flight');

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    reservationCode: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Flight,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    payerEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    payerFirstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    payerLastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    numberOfPassengers: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reservationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, { timestamps: true });

Reservation.belongsTo(Flight, { foreignKey: 'flightId' });

module.exports = Reservation;
