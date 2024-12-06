// models/Passenger.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const Reservation = require('./Reservation');

const Passenger = sequelize.define(
    'Passenger',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
        },
        dateOfBirth: { // Renombrado para mejorar claridad
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        idType: {
            type: DataTypes.ENUM('Passport', 'ID Card'),
            allowNull: false,
        },
        identificationNumber: { // Renombrado para consistencia
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: 'uniqueIdentification', // Restricción compuesta
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        reservationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Reservation,
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
        timestamps: false,
        uniqueKeys: {
            uniqueIdentification: {
                fields: ['identificationNumber', 'idType'], // Clave única compuesta
            },
        },
    }
);

Passenger.belongsTo(Reservation, { foreignKey: 'reservationId' });

module.exports = Passenger;
