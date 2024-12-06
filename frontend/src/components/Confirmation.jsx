import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/css/Confirmation.css';

const Confirmation = () => {
    const location = useLocation();
    const { orderNumber, firstName, lastName, email } = location.state || {};
    const navigate = useNavigate();

    return (
        <div className="confirmation-container">
            <h1>¡Pago Completado!</h1>
            <p>Gracias, <strong>{firstName} {lastName}</strong>, por su compra.</p>
            <p>Hemos enviado un correo a <strong>{email}</strong> con los detalles de sus boletos.</p>
            <p>Su número de orden es: <strong>{orderNumber}</strong></p>
            <h3>Gracias por viajar con Aerolíneas Quintanilla</h3>
            <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
    );
};

export default Confirmation;
