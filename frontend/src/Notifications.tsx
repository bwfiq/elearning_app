// frontend/src/Notifications.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useAxios from './useAxios';
import { Notification } from './types';

interface NotificationsProps {
    userId: number | null;
}

const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(true);
    const prevUserId = useRef<number | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (userId) {
            try {
                const response = await axiosInstance.get(`/api/users/${userId}/notifications/`);
                setNotifications(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            }
        }
    }, [axiosInstance]);

    useEffect(() => {
        // Only fetch if userId has changed
        if (userId !== prevUserId.current) {
            setLoading(true);
            fetchNotifications();
            prevUserId.current = userId; // Update the ref
        } else {
            setLoading(false); // Ensure loading is false if no fetch occurs
        }
    }, [userId, fetchNotifications]);

    const markAsRead = async (notificationId: number) => {
        try {
            await axiosInstance.patch(`/api/users/notifications/${notificationId}/mark_as_read/`);
            // Optimistically update the UI
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, is_read: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    if (loading) {
        return <div>Loading notifications...</div>;
    }

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <div>No notifications.</div>
            ) : (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id} style={{
                            backgroundColor: notification.is_read ? '#f0f0f0' : '#ffffff',
                            padding: '10px',
                            marginBottom: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}>
                            <span style={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}>
                                {notification.message} - {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            {!notification.is_read && (
                                <button onClick={() => markAsRead(notification.id)}>
                                    Mark as Read
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
