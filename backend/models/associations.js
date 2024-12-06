const Sequelize = require('sequelize');
const sequelize = require('../db/database');

// Models
const User = require('./User');
const Flight = require('./Flight');
const Route = require('./Route');
const FlightClass = require('./FlightClass');
const Baggage = require('./Baggage');
const Reservation = require('./Reservation');
const Passenger = require('./Passenger');

// Associations

// Route and Flight
Route.hasMany(Flight, { foreignKey: 'routeId', as: 'Flights' });
Flight.belongsTo(Route, { foreignKey: 'routeId', as: 'Route' });

// Flight and Reservation
Flight.hasMany(Reservation, { foreignKey: 'flightId', as: 'FlightReservations' });
Reservation.belongsTo(Flight, { foreignKey: 'flightId', as: 'ReservationFlight' });

// Reservation and Passenger
Reservation.hasMany(Passenger, { foreignKey: 'reservationId', as: 'ReservationPassengers' });
Passenger.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'PassengerReservation' });

// Export models and sequelize instance
module.exports = {
    sequelize,
    User,
    Flight,
    Route,
    FlightClass,
    Baggage,
    Reservation,
    Passenger,
};
