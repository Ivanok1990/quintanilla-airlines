import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/PassengerForm.css';

const PassengerForm = () => {
    const location = useLocation();
    const {
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
        total,
    } = location.state || {}; // Datos pasados desde FlightSummary

    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        Array.from({ length: passengers }, () => ({
            firstName: '',
            lastName: '',
            gender: 'Male',
            dateOfBirth: '',
            idType: 'Passport',
            identificationNumber: '',
            country: 'NICARAGUA',
            email: '',
        }))
    );

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFormData = [...formData];
        updatedFormData[index][name] = value;
        setFormData(updatedFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar que todos los campos requeridos estén completos
        const isValid = formData.every(
            (passenger) =>
                passenger.firstName &&
                passenger.lastName &&
                passenger.dateOfBirth &&
                passenger.idType &&
                passenger.identificationNumber &&
                passenger.country
        );

        if (!isValid) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        // Navegar al componente de Payment con todos los datos
        navigate('/payment', {
            state: {
                passengerData: formData, // Información de los pasajeros
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
                total, // Datos calculados
            },
        });
    };

    return (
        <div className="background-container-passenger">
            <div className="container-passenger-form">
                <h2>Passenger Information</h2>
                <form className="passenger-form" onSubmit={handleSubmit}>
                    {formData.map((passenger, index) => (
                        <div key={index} className="passenger-section">
                            <h3>Passenger #{index + 1}</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="e.g. John"
                                        value={passenger.firstName}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="e.g. Smith"
                                        value={passenger.lastName}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={passenger.gender}
                                        onChange={(e) => handleInputChange(index, e)}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={passenger.dateOfBirth}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>ID Type</label>
                                    <select
                                        name="idType"
                                        value={passenger.idType}
                                        onChange={(e) => handleInputChange(index, e)}
                                    >
                                        <option value="Passport">Passport</option>
                                        <option value="ID Card">ID Card</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Identification Number</label>
                                    <input
                                        type="text"
                                        name="identificationNumber"
                                        placeholder="e.g. AB1234567"
                                        value={passenger.identificationNumber}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="e.g. NICARAGUA"
                                        value={passenger.country}
                                        onChange={(e) => handleInputChange(index, e)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="e.g. john.smith@example.com"
                                        value={passenger.email}
                                        onChange={(e) => handleInputChange(index, e)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="buttons">
                        <button type="button" onClick={() => navigate(-1)}>
                            Back
                        </button>
                        <button type="submit">Continue</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PassengerForm;
