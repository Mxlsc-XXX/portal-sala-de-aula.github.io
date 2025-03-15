import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Trabalhos from './pages/Trabalhos';
import Datas from './pages/Datas';
import Apps from './pages/Apps';
import Guias from './pages/Guias';
import Planilhas from './pages/Planilhas';
import Avisos from './pages/Avisos';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trabalhos" element={<Trabalhos />} />
            <Route path="/datas" element={<Datas />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/guias" element={<Guias />} />
            <Route path="/planilhas" element={<Planilhas />} />
            <Route path="/avisos" element={<Avisos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 