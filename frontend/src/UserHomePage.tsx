// frontend/src/UserHomePage.tsx
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

interface StatusUpdate {
    id: number;
    user: number;
    text: string;
    timestamp: string;
}

function UserHomePage() {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();
    const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
    const [newStatusText, setNewStatusText] = useState('');
    const loggedInUsername = localStorage.getItem('username'); // Get logged-in username

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

    useEffect(() => {
        const fetchStatusUpdates = async () => {
            if (user) {
                try {
                    const response = await axiosInstance.get<StatusUpdate[]>(`/api/users/${user.pk}/status_updates/`);
                    setStatusUpdates(response.data);
                } catch (error) {
                    console.error('Error fetching status updates:', error);
                }
            }
        };

        fetchStatusUpdates();
    }, [user, axiosInstance]);


    const handleStatusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            try {
                await axiosInstance.post(`/api/users/${user.pk}/status_updates/`, { text: newStatusText });
                // Refresh status updates after posting
                const response = await axiosInstance.get<StatusUpdate[]>(`/api/users/${user.pk}/status_updates/`);
                setStatusUpdates(response.data);
                setNewStatusText(''); // Clear the input field
            } catch (error) {
                console.error('Error posting status update:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    const isOwnProfile = loggedInUsername === user.username;

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

            <h2>Status Updates</h2>
            <ul>
                {statusUpdates.map(update => (
                    <li key={update.id}>
                        {update.text} - {new Date(update.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>

             {isOwnProfile && (
                <form onSubmit={handleStatusSubmit}>
                    <textarea
                        value={newStatusText}
                        onChange={(e) => setNewStatusText(e.target.value)}
                        placeholder="What's on your mind?"
                    />
                    <button type="submit">Post Status</button>
                </form>
            )}
        </div>
    );
}

export default UserHomePage;
