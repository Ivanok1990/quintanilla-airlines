import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/FlightList.css';

const FlightList = () => {
    const location = useLocation();
    const { departureFlights = [], returnFlights = [], tripType, passengers } = location.state || {};
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const navigate = useNavigate();

    // Formatear fecha y hora
    const formatDateTime = (dateTime) => {
        if (!dateTime || dateTime === "Invalid Date") return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString(); // Formateo local
    };

    const handleContinue = () => {
        if (tripType === 'round' && (!selectedDeparture || !selectedReturn)) {
            alert("Please select both departure and return flights.");
            return;
        } else if (tripType === 'oneWay' && !selectedDeparture) {
            alert("Please select a departure flight.");
            return;
        }

        navigate('/flight-options', {
            state: {
                selectedDeparture,
                selectedReturn: tripType === 'round' ? selectedReturn : null,
                passengers,
            },
        });
    };

    return (
        <div className="Container-FlightList">
            <div className="flight-list">
                <h3>Departure Flights</h3>
                {departureFlights.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>Flight Number</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Departure Time</th>
                            <th>Arrival Time</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departureFlights.map((flight) => (
                            <tr key={flight.id}>
                                <td>
                                    <input
                                        type="radio"
                                        name="departureFlight"
                                        onChange={() => setSelectedDeparture(flight)}
                                    />
                                </td>
                                <td>{flight.flightNumber || "N/A"}</td>
                                <td>{flight.origin || "N/A"}</td>
                                <td>{flight.destination || "N/A"}</td>
                                <td>{formatDateTime(flight.departureTime)}</td>
                                <td>{formatDateTime(flight.arrivalTime)}</td>
                                <td>${flight.price || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-flights-message">No departure flights available for the selected date or route.</p>
                )}

                {tripType === 'round' && (
                    <>
                        <h3>Return Flights</h3>
                        {returnFlights.length > 0 ? (
                            <table>
                                <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Flight Number</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Departure Time</th>
                                    <th>Arrival Time</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {returnFlights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>
                                            <input
                                                type="radio"
                                                name="returnFlight"
                                                onChange={() => setSelectedReturn(flight)}
                                            />
                                        </td>
                                        <td>{flight.flightNumber || "N/A"}</td>
                                        <td>{flight.origin || "N/A"}</td>
                                        <td>{flight.destination || "N/A"}</td>
                                        <td>{formatDateTime(flight.departureTime)}</td>
                                        <td>{formatDateTime(flight.arrivalTime)}</td>
                                        <td>${flight.price || "N/A"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-flights-message">No return flights available for the selected date or route.</p>
                        )}
                    </>
                )}

                <div className="button-container">
                    <button onClick={() => navigate(-1)}>Back</button>
                    {(departureFlights.length > 0 || returnFlights.length > 0) && (
                        <button onClick={handleContinue}>Continue</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightList;
