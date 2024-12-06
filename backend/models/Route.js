const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Route = sequelize.define('Route', {
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = Route;
