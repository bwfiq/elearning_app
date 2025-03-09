// frontend/src/UserList.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAxios from './useAxios';

interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
    is_teacher: boolean;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(true);
    const fetchUsersRef = useRef(false);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axiosInstance.get<User[]>('/api/users/');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    }, [axiosInstance]);

    useEffect(() => {
        if (!fetchUsersRef.current) {
            setLoading(true);
            fetchUsers();
            fetchUsersRef.current = true;
        }
    }, [fetchUsers]);

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.pk}>
                        <Link to={`/${user.username}`}>{user.username}</Link> ({user.full_name}) - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
