import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.isadmin; // Verifica que `isadmin` sea true
};

const AdminRoute = () => {
    return isAdmin() ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminRoute;
