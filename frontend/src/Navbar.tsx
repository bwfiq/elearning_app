// frontend/src/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
    isLoggedIn: boolean;
    logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, logout }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home after logout
    };

    return (
        <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
                    E-Learning App
                </Link>
                {isLoggedIn && username && (
                    <>
                        <Link to={`/${username}`} style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                            Home
                        </Link>
                        <Link to="/courses" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                            Courses
                        </Link>
                        <Link to="/users" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                            Users
                        </Link>
                        <Link to="/chat" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                            Chat
                        </Link>
                    </>
                )}
            </div>
            <div>
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>Login</Link>
                        <Link to="/register" style={{ textDecoration: 'none', color: 'black' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
