// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router';
import MainContent from './components/Main';
import 'react-calendar/dist/Calendar.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <MainContent>
            <AppRouter />
          </MainContent>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
