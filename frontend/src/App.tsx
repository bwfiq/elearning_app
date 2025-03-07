import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import UserHomePage from './UserHomePage';
import Login from './Login';

interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<User[]>(`${apiUrl}/api/users/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching users:', error);
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    // Token might be invalid, force logout
                    logout();
                }
            }
        };

        if (isLoggedIn) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, apiUrl, navigate]);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        navigate('/');
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="App">
            <header>
                <h1>User List</h1>
                {isLoggedIn ? (
                    <div>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </header>
            <Routes>
                <Route path="/" element={isLoggedIn ? <UserList users={users} /> : <div>Please login to see the user list.</div>} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/:username" element={<UserHomePage />} />
            </Routes>
        </div>
    );
}

function UserList({ users }: { users: User[] }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.pk}>
                    <Link to={`/${user.username}`}>{user.username}</Link> ({user.full_name}) - {user.email}
                </li>
            ))}
        </ul>
    );
}

export default App;
