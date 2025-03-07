import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from './useAxios';

interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
    profile_picture: string | null;
    is_teacher: boolean;
}

function UserHomePage() {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get<User>(`/api/users/?username=${username}`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setUser(response.data[0]);
                } else {
                    setUser(null);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
                setUser(null);
            }
        };

        fetchUser();
    }, [username, axiosInstance]);

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <h1>User Home Page</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Full Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Registration Date:</strong> {user.registration_date}</p>
            <p><strong>Is Teacher:</strong> {user.is_teacher ? 'Yes' : 'No'}</p>
            {user.profile_picture && (
                <img src={`${axiosInstance.defaults.baseURL}${user.profile_picture}`} alt="Profile" style={{ maxWidth: '200px' }} />
            )}
        </div>
    );
}

export default UserHomePage;
