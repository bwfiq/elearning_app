// frontend/src/UserHomePage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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

interface Course {
    id: number;
    name: string;
    description: string;
    creator: number;
    students: number[];
}

const DEFAULT_PROFILE_PICTURE = 'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'; // URL to a default blank image

function UserHomePage() {
    const { username } = useParams<{ username: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();
    const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
    const [newStatusText, setNewStatusText] = useState('');
    const loggedInUsername = localStorage.getItem('username');
    const [editedFullName, setEditedFullName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Add state for the logged-in user

    // New state variables for course creation
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');

    // useRef to track if the component has mounted
    const isMounted = useRef(false);
    const isStatusUpdatesMounted = useRef(false);
    const isCourseMounted = useRef(false);
    const isUserMounted = useRef(false);

    // Use useCallback to memoize fetchUser
    const fetchUser = useCallback(async () => {
        try {
            const response = await axiosInstance.get<User>(`/api/users/?username=${username}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                setUser(response.data[0]);
                setEditedFullName(response.data[0].full_name);
                setEditedEmail(response.data[0].email);
            } else {
                setUser(null);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user:', error);
            setLoading(false);
            setUser(null);
        }
    }, [username, axiosInstance]); // Dependencies for useCallback

    // Use useCallback to memoize fetchStatusUpdates
    const fetchStatusUpdates = useCallback(async (userId: number) => {
        try {
            const response = await axiosInstance.get<StatusUpdate[]>(`/api/users/${userId}/status_updates/`);
            setStatusUpdates(response.data);
        } catch (error) {
            console.error('Error fetching status updates:', error);
        }
    }, [axiosInstance]); // Dependencies for useCallback

    const fetchCourses = useCallback(async () => {
        try {
            const response = await axiosInstance.get<Course[]>('/api/courses/');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }, [axiosInstance]);

    const fetchLoggedInUser = useCallback(async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await axiosInstance.get<User[]>(`/api/users/?username=${username}`);
            if (Array.isArray(response.data) && response.data.length > 0) {
                setLoggedInUser(response.data[0]);
            } else {
                setLoggedInUser(null);
            }
        } catch (error) {
            console.error('Error fetching logged in user:', error);
            setLoggedInUser(null);
        }
    }, [axiosInstance]);

    useEffect(() => {
        if (!isMounted.current) {
            fetchUser();
            isMounted.current = true; // Set the ref to true after initial mount
        }
    }, [fetchUser]);

    useEffect(() => {
        if (user && !isStatusUpdatesMounted.current) {
            fetchStatusUpdates(user.pk);
            isStatusUpdatesMounted.current = true
        }
    }, [user, fetchStatusUpdates]);

    useEffect(() => {
        if (!isCourseMounted.current) {
            fetchCourses();
            isCourseMounted.current = true;
        }
    }, [fetchCourses]);

    useEffect(() => {
        if (!isUserMounted.current) {
            fetchLoggedInUser();
            isUserMounted.current = true;
        }
    }, [fetchLoggedInUser]);

    const handleStatusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            try {
                await axiosInstance.post(`/api/users/${user.pk}/status_updates/`, { text: newStatusText });
                // Refresh status updates after posting
                fetchStatusUpdates(user.pk)
                setNewStatusText(''); // Clear the input field
            } catch (error) {
                console.error('Error posting status update:', error);
            }
        }
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setProfilePicture(event.target.files[0]);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            try {
                const formData = new FormData();
                formData.append('full_name', editedFullName);
                formData.append('email', editedEmail);
                if (profilePicture) {
                    formData.append('profile_picture', profilePicture);
                }

                await axiosInstance.put(`/api/users/${user.pk}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Refresh user data after update
                fetchUser();
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const handleEnrollCourse = async (courseId: number) => {
        try {
            const response = await axiosInstance.patch(`/api/courses/${courseId}/enroll/`);
            if (response.data.status === 'enrolled') {
                setEnrolledCourses([...enrolledCourses, courseId]);
            } else {
                setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
            }
            fetchCourses()
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    // New function to handle course creation
    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/courses/', {
                name: newCourseName,
                description: newCourseDescription,
            });
            // Refresh courses after creating
            fetchCourses();
            setNewCourseName('');
            setNewCourseDescription('');
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    if (loading) {
        return <div>Loading user data...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    const isOwnProfile = loggedInUsername === user.username;
    const profilePictureUrl = user.profile_picture ? `${apiUrl}${user.profile_picture}` : DEFAULT_PROFILE_PICTURE;

    return (
        <div>
            <h1>User Home Page</h1>
            <p><strong>Username:</strong> {user.username}</p>

            <img
                src={profilePictureUrl}
                alt="Profile"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
            />

            {isOwnProfile && (
                <form onSubmit={handleUpdateProfile}>
                    <div>
                        <label htmlFor="fullName">Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            value={editedFullName}
                            onChange={(e) => setEditedFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="profilePicture">Profile Picture:</label>
                        <input
                            type="file"
                            id="profilePicture"
                            onChange={handleProfilePictureChange}
                        />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            )}

            <p><strong>Full Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Registration Date:</strong> {user.registration_date}</p>
            <p><strong>Is Teacher:</strong> {user.is_teacher ? 'Yes' : 'No'}</p>

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

            <h2>Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/courses/${course.id}`}>{course.name}</Link>
                        {/* Conditionally render the button */}
                        {loggedInUser && !loggedInUser.is_teacher && (
                            <button onClick={() => handleEnrollCourse(course.id)}>
                                {course.students.includes(user.pk) ? 'Unenroll' : 'Enroll'}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Conditionally render the course creation form */}
            {user.is_teacher && (
                <div>
                    <h2>Create New Course</h2>
                    <form onSubmit={handleCreateCourse}>
                        <div>
                            <label htmlFor="newCourseName">Course Name:</label>
                            <input
                                type="text"
                                id="newCourseName"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="newCourseDescription">Course Description:</label>
                            <textarea
                                id="newCourseDescription"
                                value={newCourseDescription}
                                onChange={(e) => setNewCourseDescription(e.target.value)}
                            />
                        </div>
                        <button type="submit">Create Course</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UserHomePage;
