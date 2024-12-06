const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    profilePicture: { type: DataTypes.STRING },
    isadmin: { type: DataTypes.BOOLEAN, defaultValue: false }, // Agregamos el campo isadmin
}, { timestamps: true });

module.exports = User;
