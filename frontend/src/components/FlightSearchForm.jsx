import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/css/FlightSearchForm.css';

const FlightSearchForm = () => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        departure: '',
        return: '',
        adults: 1,
        infants: 0,
        tripType: 'round',
    });

    const [locations, setLocations] = useState({ origins: [], destinations: [] });

    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/flights/locations');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error.message);
            alert('Failed to load locations. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Limpiar el destino si es igual al origen
        if (name === 'from' && formData.to === value) {
            setFormData({ ...formData, from: value, to: '' });
        }
    };

    const handleDepartureChange = (e) => {
        const departureDate = e.target.value;
        setFormData({ ...formData, departure: departureDate });

        if (formData.return && new Date(formData.return) < new Date(departureDate)) {
            setFormData({ ...formData, return: '' });
        }
    };

    const handleReturnChange = (e) => {
        setFormData({ ...formData, return: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar datos del formulario
        if (!formData.from || !formData.to || !formData.departure) {
            alert('Please fill out all required fields.');
            return;
        }

        console.log('Sending request with:', {
            date: formData.departure,
            from: formData.from,
            to: formData.to,
        });

        try {
            // Solicitud de vuelos de ida
            const departureResponse = await axios.get('http://localhost:8080/api/flights', {
                params: { date: formData.departure, from: formData.from, to: formData.to },
            });

            let returnFlights = [];
            // Si es un viaje redondo y hay fecha de regreso, buscar vuelos de regreso
            if (formData.tripType === 'round' && formData.return) {
                const returnResponse = await axios.get('http://localhost:8080/api/flights', {
                    params: { date: formData.return, from: formData.to, to: formData.from },
                });
                returnFlights = returnResponse.data;
            }

            // Pasar datos al componente FlightList
            navigate('/flight-list', {
                state: {
                    departureFlights: departureResponse.data, // Asegúrate de que estos datos contengan origin, destination, y fechas.
                    returnFlights: formData.tripType === 'round' ? returnFlights : [],
                    tripType: formData.tripType,
                    passengers: parseInt(formData.adults, 10) + parseInt(formData.infants, 10),
                },
            });
        } catch (error) {
            console.error('Error fetching flights:', error.message);
            alert('Failed to fetch flights. Please try again later.');
        }
    };

    return (
        <div className="background-container">
            <form className="flight-search-form" onSubmit={handleSubmit}>
                <div>
                    <label>From</label>
                    <select name="from" onChange={handleInputChange} value={formData.from}>
                        <option value="">Select Origin</option>
                        {locations.origins.map((origin, index) => (
                            <option key={index} value={origin}>{origin}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>To</label>
                    <select name="to" onChange={handleInputChange} value={formData.to}>
                        <option value="">Select Destination</option>
                        {locations.destinations
                            .filter((dest) => dest !== formData.from)
                            .map((destination, index) => (
                                <option key={index} value={destination}>{destination}</option>
                            ))}
                    </select>
                </div>
                <div>
                    <label>Departure</label>
                    <input
                        type="date"
                        name="departure"
                        value={formData.departure}
                        onChange={handleDepartureChange}
                        min={today}
                    />
                </div>
                <div>
                    <label>Return</label>
                    <input
                        type="date"
                        name="return"
                        value={formData.return}
                        onChange={handleReturnChange}
                        min={formData.departure || today}
                    />
                </div>
                <div>
                    <label>Adults</label>
                    <input
                        type="number"
                        name="adults"
                        min="1"
                        max="10"
                        value={formData.adults}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Infants (under 2 years)</label>
                    <input
                        type="number"
                        name="infants"
                        min="0"
                        max="2"
                        value={formData.infants}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="tripType"
                            value="round"
                            checked={formData.tripType === 'round'}
                            onChange={handleInputChange}
                        />
                        Round Trip
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="tripType"
                            value="oneWay"
                            onChange={handleInputChange}
                        />
                        One Way
                    </label>
                </div>
                <button type="submit">Search</button>
            </form>

        </div>
    );
};

export default FlightSearchForm;
