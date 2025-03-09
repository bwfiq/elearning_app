// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import UserHomePage from './UserHomePage';
import Login from './Login';
import Register from './Register'; // Import the Register component
import CoursePage from './CoursePage'; // Import the CoursePage component

interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
}

interface Course {
    id: number;
    name: string;
    description: string;
    creator: number;
    students: number[];
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
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
            } catch (error: any) {
                console.error('Error fetching users:', error);
                if (error.response && error.response.status === 401) {
                    // Token might be invalid, force logout
                    logout();
                }
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get<Course[]>(`${apiUrl}/api/courses/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            Promise.all([fetchUsers(), fetchCourses()]);
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
        return <div>Loading users and courses...</div>;
    }

    return (
        <div className="App">
            <header>
                <h1>E-Learning App</h1>
                {isLoggedIn ? (
                    <div>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <div>
                         <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                    </div>

                )}
            </header>
            <div className="content">
                <Routes>
                    <Route path="/" element={isLoggedIn ? <HomePage users={users} courses={courses} /> : <div>Please login to see the user and course lists.</div>} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} /> {/* Add the Register route */}
                    <Route path="/:username" element={<UserHomePage />} />
                    <Route path="/courses/:courseId" element={<CoursePage />} /> {/* Add the CoursePage route */}
                </Routes>
            </div>
        </div>
    );
}

function HomePage({ users, courses }: { users: User[]; courses: Course[] }) {
    return (
        <div className="home-page">
            <div className="user-list">
                <h2>Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.pk}>
                            <Link to={`/${user.username}`}>{user.username}</Link> ({user.full_name}) - {user.email}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="course-list">
                <h2>Courses</h2>
                <ul>
                    {courses.map(course => (
                        <li key={course.id}>
                            <Link to={`/courses/${course.id}`}>{course.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
