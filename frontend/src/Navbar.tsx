// frontend/src/Navbar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NavbarProps {
    isLoggedIn: boolean;
    logout: () => void;
}

interface SearchResult {
    id: number;
    name?: string; // For courses
    username?: string; // For users
    full_name?: string;
    email?: string;
    is_teacher?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, logout }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control dropdown visibility
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const searchInputRef = useRef<HTMLInputElement>(null);
    const accessToken = localStorage.getItem('access_token');  // Get access token

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home after logout
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const fetchData = async () => {
                try {
                    const usersResponse = await axios.get<SearchResult[]>(`${apiUrl}/api/users/?search=${searchTerm}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,  // Include token
                        },
                    });
                    const coursesResponse = await axios.get<SearchResult[]>(`${apiUrl}/api/courses/?search=${searchTerm}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,  // Include token
                        },
                    });

                    // Combine and limit the results
                    const combinedResults = [...usersResponse.data, ...coursesResponse.data].slice(0, 5);
                    setSearchResults(combinedResults);
                    setIsSearchOpen(true); // Open the dropdown when results are available
                } catch (error: any) {
                    console.error('Error fetching search results:', error);
                    setSearchResults([]);
                    setIsSearchOpen(false); // Ensure dropdown is closed on error
                    // Handle 401 error if needed (e.g., redirect to login)
                    if (error.response && error.response.status === 401) {
                        console.log('Authentication required.  Redirect to login or refresh token.');
                        // Potentially redirect to login or attempt token refresh here
                    }
                }
            };

            fetchData();
        } else {
            setSearchResults([]);
            setIsSearchOpen(false); // Close the dropdown when search term is empty
        }
    }, [searchTerm, apiUrl, accessToken]);

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearchOpen(false);
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

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={searchInputRef}>
                <input
                    type="text"
                    placeholder="Search users and courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                {searchTerm && (
                    <button onClick={clearSearch} style={{ marginLeft: '5px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2em' }}>
                        &times;
                    </button>
                )}
                {isSearchOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginTop: '5px',
                        width: '300px',
                        zIndex: 10,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                        {searchResults.length > 0 ? (
                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                {searchResults.map(result => (
                                    <li key={result.id} style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
                                        {result.username ? (
                                            <Link to={`/${result.username}`} style={{ display: 'block', textDecoration: 'none', color: 'black' }} onClick={() => setIsSearchOpen(false)}>
                                                {result.full_name} ({result.username})
                                            </Link>
                                        ) : (
                                            <Link to={`/courses/${result.id}`} style={{ display: 'block', textDecoration: 'none', color: 'black' }} onClick={() => setIsSearchOpen(false)}>
                                                {result.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ padding: '8px 12px', color: '#777' }}>No results found.</div>
                        )}
                    </div>
                )}
            </div>

            <div>
                 {isLoggedIn && username && (  // Add this section
                    <span style={{ marginRight: '10px' }}>
                        Logged in as: {username}
                    </span>
                )}
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
