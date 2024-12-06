import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/FlightSummary.css';

const FlightSummary = () => {
    const location = useLocation();
    const { selectedDeparture, selectedReturn, selectedClass, selectedBaggage, passengers } = location.state || {};
    const navigate = useNavigate();

    const [classPrices, setClassPrices] = useState({});
    const [baggagePrice, setBaggagePrice] = useState(0);

    useEffect(() => {
        const fetchClassPrices = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/options/flight-classes');
                const prices = response.data.reduce((acc, item) => {
                    acc[item.className] = parseFloat(item.classPrice);
                    return acc;
                }, {});
                console.log('Class Prices:', prices); // Para verificar los precios de las clases
                setClassPrices(prices);
            } catch (error) {
                console.error('Error fetching class prices:', error);
            }
        };

        const fetchBaggagePrice = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/options/baggage');
                console.log('Baggage Options:', response.data); // Para verificar las opciones de equipaje
                const extraBaggageOption = response.data.find(b => selectedBaggage.includes(b.id));
                console.log('Selected Baggage:', selectedBaggage); // Para verificar los IDs de equipaje seleccionados
                console.log('Extra Baggage Option:', extraBaggageOption); // Para verificar la opción de equipaje adicional
                setBaggagePrice(extraBaggageOption ? parseFloat(extraBaggageOption.baggagePrice) : 0);
            } catch (error) {
                console.error('Error fetching baggage price:', error);
            }
        };

        fetchClassPrices();
        fetchBaggagePrice();
    }, [selectedBaggage]);

    const numberOfPassengers = parseInt(passengers, 10) || 1;
    console.log('Number of Passengers:', numberOfPassengers);

    const departurePrice = selectedDeparture ? parseFloat(selectedDeparture.price) || 0 : 0;
    const returnPrice = selectedReturn ? parseFloat(selectedReturn.price) || 0 : 0;
    const classPrice = classPrices[selectedClass] || 0;

    console.log('Departure Price:', departurePrice);
    console.log('Return Price:', returnPrice);
    console.log('Class Price:', classPrice);

    const ticketPrice = (departurePrice + returnPrice) * numberOfPassengers;
    const farePrice = classPrice * numberOfPassengers;
    const subtotal = ticketPrice + farePrice + baggagePrice;
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    console.log('Ticket Price:', ticketPrice);
    console.log('Fare Price:', farePrice);
    console.log('Baggage Price:', baggagePrice);
    console.log('Subtotal:', subtotal);
    console.log('Tax:', tax);
    console.log('Total:', total);

    const handleContinue = () => {
        navigate('/passenger-form', {
            state: {
                passengers,
                selectedDeparture,
                selectedReturn,
                selectedClass,
                selectedBaggage,
                ticketPrice,
                farePrice,
                baggagePrice,
                subtotal,
                tax,
                total
            }
        });
    };





    return (
        <div className="Container-Summary">
            <div className="flight-summary">
                <h3>Flight Schedule - Quintanilla Airlines Flight Summary</h3>
                <div className="flight-details">
                    <div>
                        <h4>Departure</h4>
                        <p><strong>{selectedDeparture.origin}</strong> - ({selectedDeparture.originCode})
                            ✈ {selectedDeparture.destination} - ({selectedDeparture.destinationCode})</p>
                        <p>{selectedDeparture.date}</p>
                        <p><strong>Flight:</strong> {selectedDeparture.flightNumber}</p>
                        <p><strong>Route:</strong> {selectedDeparture.departureTime} - {selectedDeparture.arrivalTime}</p>
                        <p><strong>Duration:</strong> {selectedDeparture.duration}</p>
                    </div>
                    {selectedReturn && (
                        <div>
                            <h4>Return</h4>
                            <p><strong>{selectedReturn.origin}</strong> - ({selectedReturn.originCode})
                                ✈ {selectedReturn.destination} - ({selectedReturn.destinationCode})</p>
                            <p>{selectedReturn.date}</p>
                            <p><strong>Flight:</strong> {selectedReturn.flightNumber}</p>
                            <p><strong>Route:</strong> {selectedReturn.departureTime} - {selectedReturn.arrivalTime}</p>
                            <p><strong>Duration:</strong> {selectedReturn.duration}</p>
                        </div>
                    )}
                </div>
                <div className="receipt">
                    <h4>Passengers:</h4>
                    <p><strong>({numberOfPassengers}) Adults</strong></p>
                    <p><strong>Fare:</strong> ${ticketPrice.toFixed(2)}</p>
                    <p><strong>Luggage package ({selectedClass}):</strong> ${farePrice.toFixed(2)}</p>
                    {baggagePrice > 0 &&
                        <p><strong>Additional checked bag (30lbs):</strong> ${baggagePrice.toFixed(2)}</p>}
                    <p><strong>Sub Total:</strong> ${subtotal.toFixed(2)}</p>
                    <p><strong>Tax:</strong> ${tax.toFixed(2)}</p>
                    <h3><strong>Total:</strong> ${total.toFixed(2)}</h3>
                </div>
                <div className="buttons">
                    <button onClick={() => navigate(-1)}>Back</button>
                    <button onClick={handleContinue}>Continue</button>
                </div>
            </div>
        </div>
    );
};

export default FlightSummary;
