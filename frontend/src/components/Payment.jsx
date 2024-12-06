import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/Payment.css';

const Payment = () => {
    const location = useLocation();
    const {
        passengers,
        selectedDeparture,
        selectedReturn,
        selectedClass,
        ticketPrice = 0,
        baggagePrice = 0,
        subtotal = 0,
        tax = 0,
        total = 0,
    } = location.state || {};

    const navigate = useNavigate();

    const [paymentDetails, setPaymentDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        cardType: '',
        cardNumber: '',
        expirationMonth: 'January',
        expirationYear: '2024',
        securityCode: '',
        cardholderFirstName: '',
        cardholderLastName: '',
        billingAddress: '',
        contactPhone: '',
    });

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails({ ...paymentDetails, [name]: value });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Crear reservación
            const reservationResponse = await fetch('http://localhost:8080/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flightId: selectedDeparture.id,
                    numberOfPassengers: passengers,
                    totalPrice: total,
                    payerFirstName: paymentDetails.firstName,
                    payerLastName: paymentDetails.lastName,
                    payerEmail: paymentDetails.email,
                    orderId,
                }),
            });

            if (!reservationResponse.ok) {
                throw new Error('Error al crear la reservación.');
            }

            const reservation = await reservationResponse.json();

            // Procesar pago
            const paymentResponse = await fetch('http://localhost:8080/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId: reservation.id,
                    paymentDetails,
                }),
            });

            if (!paymentResponse.ok) {
                throw new Error('Error al procesar el pago.');
            }

            const { orderNumber } = await paymentResponse.json();

            // Redirigir a la confirmación
            navigate('/confirmation', {
                state: {
                    orderNumber,
                    firstName: paymentDetails.firstName,
                    lastName: paymentDetails.lastName,
                    email: paymentDetails.email,
                },
            });
        } catch (error) {
            console.error('Error procesando el pago:', error);
            alert('Hubo un error procesando el pago. Por favor, inténtelo nuevamente.');
        }
    };

    return (
        <div className="Container-Summary">
            <div className="flight-summary">
                <h3>Resumen de Vuelo - Quintanilla Airlines</h3>
                <div className="flight-details">
                    {selectedDeparture && (
                        <div>
                            <h4>Salida</h4>
                            <p>
                                <strong>{selectedDeparture.origin}</strong> - (
                                {selectedDeparture.originCode})
                                ✈ {selectedDeparture.destination} - (
                                {selectedDeparture.destinationCode})
                            </p>
                            <p>{selectedDeparture.date}</p>
                            <p>
                                <strong>Vuelo:</strong> {selectedDeparture.flightNumber}
                            </p>
                            <p>
                                <strong>Ruta:</strong> {selectedDeparture.departureTime} -{' '}
                                {selectedDeparture.arrivalTime}
                            </p>
                            <p>
                                <strong>Duración:</strong> {selectedDeparture.duration}
                            </p>
                        </div>
                    )}

                    {selectedReturn && (
                        <div>
                            <h4>Regreso</h4>
                            <p>
                                <strong>{selectedReturn.origin}</strong> - (
                                {selectedReturn.originCode})
                                ✈ {selectedReturn.destination} - (
                                {selectedReturn.destinationCode})
                            </p>
                            <p>{selectedReturn.date}</p>
                            <p>
                                <strong>Vuelo:</strong> {selectedReturn.flightNumber}
                            </p>
                            <p>
                                <strong>Ruta:</strong> {selectedReturn.departureTime} -{' '}
                                {selectedReturn.arrivalTime}
                            </p>
                            <p>
                                <strong>Duración:</strong> {selectedReturn.duration}
                            </p>
                        </div>
                    )}
                </div>

                <div className="receipt">
                    <h4>Passengers:</h4>
                    <p>
                        <strong>({passengers}) Adults</strong>
                    </p>
                    <table>
                        <tbody>
                        <tr>
                            <td>Fare</td>
                            <td>${ticketPrice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Luggage Package ({selectedClass})</td>
                            <td>${baggagePrice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Sub Total</td>
                            <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>${tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>${total.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="payment-form">
                    <h4>Payment Information</h4>
                    <form onSubmit={handlePaymentSubmit}>
                        {/* Información del pagador */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="e.g. myinbox@outlook.com"
                                    value={paymentDetails.email}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="e.g. Juan Carlos"
                                    value={paymentDetails.firstName}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="e.g. López García"
                                    value={paymentDetails.lastName}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Información de la tarjeta */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="e.g. 4111 1111 1111 1111"
                                    value={paymentDetails.cardNumber}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Card Type</label>
                                <select
                                    name="cardType"
                                    value={paymentDetails.cardType}
                                    onChange={handlePaymentChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Card Type
                                    </option>
                                    <option value="Visa">Visa</option>
                                    <option value="MasterCard">MasterCard</option>
                                    <option value="Amex">Amex</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Security Code (CVV)</label>
                                <input
                                    type="password"
                                    name="securityCode"
                                    placeholder="e.g. 123"
                                    value={paymentDetails.securityCode}
                                    onChange={handlePaymentChange}
                                    maxLength="4"
                                    required
                                />
                            </div>
                        </div>

                        {/* Información del titular de la tarjeta */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Cardholder First Name</label>
                                <input
                                    type="text"
                                    name="cardholderFirstName"
                                    placeholder="e.g. Juan"
                                    value={paymentDetails.cardholderFirstName}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Cardholder Last Name</label>
                                <input
                                    type="text"
                                    name="cardholderLastName"
                                    placeholder="e.g. Pérez"
                                    value={paymentDetails.cardholderLastName}
                                    onChange={handlePaymentChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit">Pagar</button>
                    </form>
                </div>

            </div>

        </div>
    );
};

export default Payment;
