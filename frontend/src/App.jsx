import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Layout from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { LiveMonitor } from './pages/LiveMonitor';
import { Inventory } from './pages/Inventory';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { Configuration } from './pages/Configuration';

function App() {
    return (
        <SocketProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/live" element={<LiveMonitor />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/config" element={<Configuration />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </Router>
        </SocketProvider>
    );
}

export default App;
