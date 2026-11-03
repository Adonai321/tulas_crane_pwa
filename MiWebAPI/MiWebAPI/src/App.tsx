import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './shared/components/Layout'; // El Header y Footer con tu diseño original
import { LandingPage } from './features/public-client/pages/LandingPage'; // La pantalla principal del cliente
import { LoginPage } from './features/admin-dashboard/pages/LoginPage'; // El login del admin

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Vista pública del cliente: envuelta en el Layout (Header + Footer) */}
                <Route element={<Layout />}>
                    <Route path="/" element={<LandingPage />} />
                </Route>

                {/* 2. Vista de Login de Administrador: independiente (sin el menú público) */}
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;