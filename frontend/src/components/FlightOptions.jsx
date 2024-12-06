// FlightOptions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/FlightOptions.css';

const FlightOptions = () => {
    const location = useLocation();
    const { selectedDeparture, selectedReturn, passengers } = location.state || {};
    const [flightClasses, setFlightClasses] = useState([]);
    const [baggageOptions, setBaggageOptions] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedBaggage, setSelectedBaggage] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classesResponse = await axios.get('http://localhost:8080/api/options/flight-classes');
                const baggageResponse = await axios.get('http://localhost:8080/api/options/baggage');
                setFlightClasses(classesResponse.data);
                setBaggageOptions(baggageResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handleBaggageSelection = (baggageId) => {
        setSelectedBaggage((prevSelected) =>
            prevSelected.includes(baggageId)
                ? prevSelected.filter((id) => id !== baggageId)
                : [...prevSelected, baggageId]
        );
    };

    const handleSubmit = () => {
        const bookingDetails = {
            selectedDeparture,
            selectedReturn,
            selectedClass,
            selectedBaggage,
            passengers,
        };
        navigate('/booking-summary', { state: bookingDetails });
    };

    return (
        <div className="Container-FlightOptions">
            <h2 className="title">Choose Your Fare</h2>
            <p className="subtitle">(The selected fare type applies to all passengers for all flights)</p>
            <div className="options-container">
                {flightClasses.map((flightClass) => (
                    <div
                        key={flightClass.id}
                        className={`option-card ${selectedClass === flightClass.className ? 'selected' : ''}`}
                        onClick={() => setSelectedClass(flightClass.className)}
                    >
                        <input
                            type="radio"
                            name="class"
                            value={flightClass.className}
                            checked={selectedClass === flightClass.className}
                            onChange={() => setSelectedClass(flightClass.className)}
                        />
                        <h3>{flightClass.className}</h3>
                        <ul>
                            <li>Seat Included</li>
                            {flightClass.className === 'Economy' && <li>Personal Item (10lbs)</li>}
                            {flightClass.className === 'Tourist' && <li>Checked Bag (30lbs)</li>}
                            {flightClass.className === 'First' && (
                                <>
                                    <li>Priority check-in at the airport</li>
                                    <li>Carry On (20lbs)</li>
                                    <li>Checked Bag (30lbs)</li>
                                </>
                            )}
                        </ul>
                        <div className="price">
                            ${!isNaN(parseFloat(flightClass.classPrice)) ? parseFloat(flightClass.classPrice).toFixed(2) : 'N/A'}
                        </div>
                    </div>
                ))}
            </div>

            <h3>Extra Baggage</h3>
            <div className="additional-options">
                {baggageOptions.map((baggage) => (
                    <label key={baggage.id} className="additional-option">
                        <input
                            type="checkbox"
                            checked={selectedBaggage.includes(baggage.id)}
                            onChange={() => handleBaggageSelection(baggage.id)}
                        />
                        {baggage.baggageType} ${!isNaN(parseFloat(baggage.baggagePrice)) ? parseFloat(baggage.baggagePrice).toFixed(2) : 'N/A'}
                    </label>
                ))}
            </div>

            <div className="button-container">
                <button className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
                <button className="continue-button" onClick={handleSubmit}>Continue to Booking Summary</button>
            </div>
        </div>
    );
};

export default FlightOptions;
