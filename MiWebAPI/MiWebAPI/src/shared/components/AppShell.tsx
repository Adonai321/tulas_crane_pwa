import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import './AppShell.css';

export const AppShell = () => {
    return (
        <div className="tc-layout-wrapper">
            <Header />

            {/* Contenido de la página actual (Landing Page) */}
            <main className="tc-main-content">
                <Outlet />
            </main>
        </div>
    );
};