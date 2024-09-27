// src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Use the login function from AuthContext

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = await loginUser({ email, password });

            // Call the login function from context to store token and API key
            login(userData.data.accessToken, userData.data.apiKey);

            navigate('/user-dashboard'); // Redirect to user dashboard
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors[0].message);
            } else {
                setError('Invalid email or password');
            }
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>
            <form
                onSubmit={handleLogin}
                className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg"
            >
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
            <p className="text-center mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login;
