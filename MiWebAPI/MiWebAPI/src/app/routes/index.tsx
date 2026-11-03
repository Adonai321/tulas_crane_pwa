import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importamos los Cascarones
import { AppShell } from '@shared/components/AppShell';
// import { AppShellWithFooter } from '@shared/components/AppShellWithFooter'; // Para cuando tengas el catálogo
import { AdminLayout } from '@features/admin-dashboard/pages/AdminLayout';

// 2. Importamos las páginas
import { LandingPage } from '@features/public-client/pages/LandingPage';
import { LoginPage } from '@features/admin-dashboard/pages/LoginPage';
import { DashboardPage } from '@features/admin-dashboard/pages/DashboardPage';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ZONA 1: Cliente Público (Con cascarón sin Footer) */}
                <Route element={<AppShell />}>
                    <Route path="/" element={<LandingPage />} />
                </Route>

                {/* ZONA 2: Login Privado (Sin cascarón, ocupa toda la pantalla) */}
                <Route path="/login" element={<LoginPage />} />

                {/* ZONA 3: Administrador (Con cascarón AdminLayout oscuro) */}
                <Route path="/admin" element={<AdminLayout />}>
                    {/* Esta ruta es la que React no encontraba */}
                    <Route path="dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};