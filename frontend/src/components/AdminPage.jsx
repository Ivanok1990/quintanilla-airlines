import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import {
    Chart as ChartJS,
    BarElement,
    BarController,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import '../components/css/admin.css';

// Registrar elementos de Chart.js
ChartJS.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const AdminPage = () => {
    const [admin, setAdmin] = useState({ name: 'Admin User', role: 'admin' });
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [formData, setFormData] = useState({});
    const [defaultFields, setDefaultFields] = useState({});
    const [file, setFile] = useState(null);
    const chartRef = useRef(null);

    const navigate = useNavigate();

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const [usersRes, flightsRes, routesRes, reservationsRes] = await Promise.all([
                fetch('http://localhost:8080/api/admin/users', { credentials: 'include' }).then((res) => res.json()),
                fetch('http://localhost:8080/api/admin/flights', { credentials: 'include' }).then((res) => res.json()),
                fetch('http://localhost:8080/api/admin/routes', { credentials: 'include' }).then((res) => res.json()),
                fetch('http://localhost:8080/api/admin/reservations', { credentials: 'include' }).then((res) => res.json()),
            ]);

            setUsers(usersRes);
            setFlights(flightsRes);
            setRoutes(routesRes);
            setReservations(reservationsRes);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/flights/popular', { credentials: 'include' });
            const data = await response.json();
            setChartData(data);
        } catch (err) {
            console.error('Error fetching chart data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchChartData();
    }, []);

    useEffect(() => {
        if (chartData) {
            renderChart();
        }
    }, [chartData]);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('popularFlightsChart').getContext('2d');
        const labels = chartData.map((flight) => flight.ReservationFlight.flightNumber);
        const data = chartData.map((flight) => flight.reservationCount);

        chartRef.current = new ChartJS(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Número de Reservaciones',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                navigate('/');
            } else {
                console.error('Error al cerrar sesión');
            }
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        }
    };

    const entityFields = {
        users: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            isadmin: false,
        },
        flights: {
            flightNumber: '',
            departureTime: '',
            arrivalTime: '',
            price: '',
            seatsAvailable: '',
            routeId: '',
        },
        routes: {
            origin: '',
            destination: '',
            duration: '',
        },
        reservations: {
            reservationCode: '',
            flightId: '',
            payerFirstName: '',
            payerLastName: '',
            payerEmail: '',
            totalPrice: '',
            numberOfPassengers: '',
        },
    };

    const handleOpenForm = (entity, data = null) => {
        setSelectedEntity(entity);
        setFormData(data || entityFields[entity]);
        setDefaultFields(entityFields[entity]);
        setFile(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async (entity, method) => {
        try {
            const endpoint = `http://localhost:8080/api/admin/${entity}`;
            const isUserWithFile = entity === 'users' && file;
            const form = new FormData();

            if (isUserWithFile) {
                Object.keys(formData).forEach((key) => form.append(key, formData[key]));
                form.append('profilePicture', file);
            }

            const config = {
                method: method,
                credentials: 'include',
                body: isUserWithFile ? form : JSON.stringify(formData),
                headers: isUserWithFile
                    ? undefined
                    : { 'Content-Type': 'application/json' },
            };

            const response = await fetch(
                method === 'POST' ? endpoint : `${endpoint}/${formData.id}`,
                config
            );

            if (!response.ok) {
                throw new Error('Error al guardar los datos');
            }

            fetchData();
            setSelectedEntity(null);
        } catch (err) {
            console.error('Error saving data:', err);
        }
    };

    const handleDelete = async (entity, id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/${entity}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar los datos');
            }
            fetchData();
        } catch (err) {
            console.error('Error deleting data:', err);
        }
    };
    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <button className="logout-btn" onClick={handleLogout}>Logout</button>

            <section>
                <h2>Vuelos Populares</h2>
                <canvas id="popularFlightsChart" width="400" height="200"></canvas>
            </section>

            <section>
                <h2>Usuarios</h2>
                <button onClick={() => handleOpenForm('users')}>Añadir Usuario</button>
                {users.map((user) => (
                    <div key={user.id} className="entity-item">
                        {user.firstName} {user.lastName} - {user.email}
                        <button onClick={() => handleOpenForm('users', user)}>Editar</button>
                        <button onClick={() => handleDelete('users', user.id)}>Eliminar</button>
                    </div>
                ))}
            </section>

            {/* Vuelos */}
            <section>
                <h2>Vuelos</h2>
                <button onClick={() => handleOpenForm('flights')}>Añadir Vuelo</button>
                {flights.map((flight) => (
                    <div key={flight.id} className="entity-item">
                        {flight.flightNumber} - {flight.price} USD
                        <button onClick={() => handleOpenForm('flights', flight)}>Editar</button>
                        <button onClick={() => handleDelete('flights', flight.id)}>Eliminar</button>
                    </div>
                ))}
            </section>

            {/* Rutas */}
            <section>
                <h2>Rutas</h2>
                <button onClick={() => handleOpenForm('routes')}>Añadir Ruta</button>
                {routes.map((route) => (
                    <div key={route.id} className="entity-item">
                        {route.origin} - {route.destination} ({route.duration})
                        <button onClick={() => handleOpenForm('routes', route)}>Editar</button>
                        <button onClick={() => handleDelete('routes', route.id)}>Eliminar</button>
                    </div>
                ))}
            </section>

            {/* Reservaciones */}
            <section>
                <h2>Reservaciones</h2>
                <button onClick={() => handleOpenForm('reservations')}>Añadir Reservación</button>
                {reservations.map((reservation) => (
                    <div key={reservation.id} className="entity-item">
                        {reservation.reservationCode} - {reservation.payerFirstName} {reservation.payerLastName}
                        <button onClick={() => handleOpenForm('reservations', reservation)}>Editar</button>
                        <button onClick={() => handleDelete('reservations', reservation.id)}>Eliminar</button>
                    </div>
                ))}
            </section>

            <section>
                <h2>Admin Chat</h2>
                <Chat user={admin}/>
            </section>


            {/* Modal para Crear/Editar */}
            {selectedEntity && (
                <div className="modal">
                    <h2>{formData.id ? 'Editar' : 'Crear'} {selectedEntity}</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(selectedEntity, formData.id ? 'PUT' : 'POST');
                        }}
                    >
                        {Object.keys(defaultFields).map((key) => (
                            <div key={key} className="form-field">
                                <label>{key}</label>
                                <input
                                    name={key}
                                    value={formData[key] || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
                        {selectedEntity === 'users' && (
                            <div className="form-field">
                                <label>Foto de Perfil</label>
                                <input type="file" onChange={handleFileChange}/>
                            </div>
                        )}
                        <button type="submit" className="btn-save">Guardar</button>
                        <button type="button" className="btn-cancel" onClick={() => setSelectedEntity(null)}>Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminPage;