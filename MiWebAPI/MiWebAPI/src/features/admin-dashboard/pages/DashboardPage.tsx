import React from 'react';
import './DashboardPage.css';

export const DashboardPage = () => {
    return (
        <div className="dashboard-wrapper">
            {/* ENCABEZADO */}
            <header className="dashboard-header">
                <div className="admin-profile">
                    <i className="bi bi-person-circle profile-icon"></i>
                    <div className="admin-greeting-block">
                        <h1 className="admin-greeting">HOLA, ADMINISTRADOR</h1>
                        <p className="admin-date">Martes, 9 de septiembre de 2026</p>
                    </div>
                </div>
            </header>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="dashboard-grid">

                {/* COLUMNA IZQUIERDA (Métricas 2x2) */}
                <div className="metrics-section">
                    <div className="metric-card">
                        <div className="metric-top">
                            <h3 className="metric-title">Cotizaciones</h3>
                        </div>
                        <div className="metric-body">
                            <i className="bi bi-clipboard2-check metric-icon"></i>
                            <div className="metric-data">
                                <span className="metric-value">5</span>
                                <span className="metric-label">pendientes</span>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-top">
                            <h3 className="metric-title">Maniobras</h3>
                        </div>
                        <div className="metric-body">
                            <i className="bi bi-wrench-adjustable metric-icon"></i>
                            <div className="metric-data">
                                <span className="metric-value">3</span>
                                <span className="metric-label">Proximas</span>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-top">
                            <h3 className="metric-title">Maquinaria</h3>
                        </div>
                        <div className="metric-body">
                            <i className="bi bi-truck metric-icon"></i>
                            <div className="metric-data">
                                <span className="metric-value">4</span>
                                <span className="metric-label">Disponibles</span>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-top">
                            <h3 className="metric-title">Empleados</h3>
                        </div>
                        <div className="metric-body">
                            <i className="bi bi-person-vcard metric-icon"></i>
                            <div className="metric-data">
                                <span className="metric-value">2</span>
                                <span className="metric-label">Disponibles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA (Alertas y Acciones) */}
                <div className="actions-section">

                    {/* Alertas (Fondo Crema) */}
                    <div className="alerts-card">
                        <div className="alerts-header">
                            <h3 className="alerts-title">ALERTAS IMPORTANTES</h3>
                            <button className="btn-view-all">Ver todo</button>
                        </div>

                        <div className="alerts-body">
                            <div className="alerts-list">
                                <div className="alert-item">
                                    <strong>Licencia de Juan perez</strong>
                                    <span>Vence en 3 dias</span>
                                </div>
                                <div className="alert-item">
                                    <strong>Seguro Grua LINKBELT</strong>
                                    <span>Vence en 20 dias</span>
                                </div>
                                <div className="alert-item">
                                    <strong>Maniobra programada para mañana</strong>
                                    <span>8:00 am</span>
                                </div>
                                <div className="alert-item">
                                    <strong>Pago de tenencia proximo</strong>
                                    <span>10 dias</span>
                                </div>
                            </div>
                            <div className="alerts-icon-wrapper">
                                <i className="bi bi-calendar3"></i>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="quick-actions-container">
                        <h3 className="quick-actions-title">ACCIONES RAPIDAS</h3>
                        <div className="quick-actions-grid">
                            <button className="action-btn">Registrar maniobra</button>
                            <button className="action-btn">Agregar empleado</button>
                            <button className="action-btn">Agregar Maquinaria</button>
                            <button className="action-btn">Ver calendario</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};