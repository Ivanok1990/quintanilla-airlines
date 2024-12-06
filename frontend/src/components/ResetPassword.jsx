import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                token,
                password,
            });
            setMessage(response.data.message || 'Contraseña restablecida exitosamente.');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Error al restablecer la contraseña. Por favor, inténtalo de nuevo más tarde.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Restablecer Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Ingresa tu nueva contraseña"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirma tu nueva contraseña"
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </button>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
