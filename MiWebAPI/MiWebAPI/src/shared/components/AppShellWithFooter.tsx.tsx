import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import './AppShell.css';

export const AppShellWithFooter = () => {
    return (
        <div className="tc-layout-wrapper">
            <Header />

            {/* Contenido de la página actual (Maquinaria, Contacto, etc.) */}
            <main className="tc-main-content">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};