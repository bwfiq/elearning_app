// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import UserHomePage from './UserHomePage';
import Login from './Login';
import Register from './Register'; // Import the Register component
import CoursePage from './CoursePage'; // Import the CoursePage component
import Navbar from './Navbar'; // Import the Navbar component
import Chat from './Chat'; // Import the Chat component
import Notifications from './Notifications';


interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
    is_teacher: boolean;
}

function App() {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
          try {
              const username = localStorage.getItem('username');
              const response = await axios.get<User[]>(`${apiUrl}/api/users/?username=${username}`);
               if (Array.isArray(response.data) && response.data.length > 0) {
                  setLoggedInUser(response.data[0]);
              } else {
                  setLoggedInUser(null);
              }
          } catch (error) {
              console.error('Error fetching logged in user:', error);
              setLoggedInUser(null);
          } finally {
            setLoading(false);
          }
      };

        if (isLoggedIn) {
            fetchLoggedInUser();
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
        return <div>Loading...</div>;
    }

    return (
        <div className="App">
            <Navbar isLoggedIn={isLoggedIn} logout={logout} />
            <div className="content">
                <Routes>
                    <Route path="/" element={isLoggedIn && loggedInUser ? <Notifications userId={loggedInUser.pk} /> : <div>Please login to see your notifications.</div>} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} /> {/* Add the Register route */}
                    <Route path="/:username" element={<UserHomePage />} />
                    <Route path="/courses/:courseId" element={<CoursePage />} /> {/* Add the CoursePage route */}
                    <Route path="/chat" element={<Chat />} /> {/* Add the Chat route */}

                </Routes>
            </div>
        </div>
    );
}

export default App;
