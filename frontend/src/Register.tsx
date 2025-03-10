// frontend/src/Register.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isTeacher, setIsTeacher] = useState(false); // New state for teacher status
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await axios.post(`${apiUrl}/api/users/register/`, {
                username: username,
                password: password,
                full_name: fullName,
                email: email,
                is_teacher: isTeacher, // Send teacher status to the backend
            });
            // Registration successful, redirect to login page or home page
            navigate('/login');
        } catch (error: any) {
            setError('Registration failed. Please check your information.');
            console.error('Registration failed:', error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>
                        Register as:
                        <input
                            type="radio"
                            value="student"
                            checked={!isTeacher}
                            onChange={() => setIsTeacher(false)}
                        />
                        Student
                        <input
                            type="radio"
                            value="teacher"
                            checked={isTeacher}
                            onChange={() => setIsTeacher(true)}
                        />
                        Teacher
                    </label>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
