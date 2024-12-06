import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import FlightSearchForm from './components/FlightSearchForm';
import DestinationDetails from './components/DestinationDetails';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Footer from './components/Footer';
import FlightList from './components/FlightList';
import FlightOptions from './components/FlightOptions';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import FlightSummary from './components/FlightSummary';
import PassengerForm from './components/PassengerForm';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import AdminPage from './components/AdminPage';
import PrivateRoute from './components/PrivateRoute'; // Ruta protegida para usuarios
import AdminRoute from './components/adminRoute'; // Ruta protegida para administradores
import SearchReservation from './components/SearchReservation';

const HomePage = () => (
    <div>
        <FlightSearchForm />
        <DestinationDetails />
    </div>
);

const AppContent = () => {
    const location = useLocation(); // Hook para obtener la ruta actual

    // Determina si el Header debe mostrarse o no
    const showHeader = location.pathname !== '/admin';

    return (
        <div>
            {showHeader && <Header />} {/* Renderiza el Header solo si no estás en /admin */}
            <main>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/flight-list" element={<FlightList />} />
                    <Route path="/flight-options" element={<FlightOptions />} />
                    <Route path="/booking-summary" element={<FlightSummary />} />
                    <Route path="/passenger-form" element={<PassengerForm passengerCount={1} />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/search-reservation" element={<SearchReservation />} />

                    {/* Rutas protegidas para usuarios autenticados */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Rutas protegidas para administradores */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
