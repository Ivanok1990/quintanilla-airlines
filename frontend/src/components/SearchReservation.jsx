import React, { useState } from 'react';
import axios from 'axios';
import '../components/css/SearchReservation.css';

const SearchReservation = () => {
    const [reservationCode, setReservationCode] = useState('');
    const [reservationDetails, setReservationDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setError(null);
        setReservationDetails(null);

        if (!reservationCode.trim()) {
            setError('Por favor, ingresa un número de reservación válido.');
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:8080/api/reservations/${reservationCode}`
            );
            setReservationDetails(response.data);
        } catch (error) {
            setError('No se encontró la reservación. Verifica el número ingresado.');
        }
    };

    return (
        <div className="search-reservation">
            <h1>Buscar Reservación</h1>
            <input
                type="text"
                placeholder="Código de Reservación (e.g., RES-123456)"
                value={reservationCode}
                onChange={(e) => setReservationCode(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>
            {error && <p className="error">{error}</p>}
            {reservationDetails && (
                <div className="reservation-details">
                    <h2>Detalles de la Reservación</h2>
                    <p><strong>Nombre del Pagador:</strong> {`${reservationDetails.payerFirstName} ${reservationDetails.payerLastName}`}</p>
                    <p><strong>Email del Pagador:</strong> {reservationDetails.payerEmail}</p>
                    <p><strong>Código de Reservación:</strong> {reservationDetails.reservationCode}</p>
                    <p><strong>Estado:</strong> {reservationDetails.status}</p>
                    <p><strong>Total Pagado:</strong> ${reservationDetails.totalPrice}</p>
                    <p><strong>ID del Vuelo:</strong> {reservationDetails.flightId}</p>
                    <p><strong>Número de Pasajeros:</strong> {reservationDetails.numberOfPassengers}</p>
                </div>
            )}
        </div>
    );
};

export default SearchReservation;
