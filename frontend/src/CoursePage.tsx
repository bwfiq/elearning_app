// frontend/src/CoursePage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from './useAxios';
import { CourseMaterial } from './types'; // Import the CourseMaterial interface

interface Course {
    id: number;
    name: string;
    description: string;
    creator: number;
    students: number[];
}

interface User {
    pk: number;
    username: string;
    full_name: string;
    email: string;
    registration_date: string;
}

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();
    const [studentDetails, setStudentDetails] = useState<User[]>([]);
    const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(null);

    // New state variables for course material creation
    const [newMaterialTextContent, setNewMaterialTextContent] = useState('');
    const [newMaterialFile, setNewMaterialFile] = useState<File | null>(null);

    // useRef to track if the component has mounted
    const isMounted = useRef(false);
    const isMaterialMounted = useRef(false);
    const isUserMounted = useRef(false);

    // Use useCallback to memoize fetchCourse
    const fetchCourse = useCallback(async () => {
        try {
            const response = await axiosInstance.get<Course>(`/api/courses/${courseId}/`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching course:', error);
            setLoading(false);
        }
    }, [courseId, axiosInstance]);

    const fetchStudentDetails = useCallback(async (studentIds: number[]) => {
        try {
            const studentDetailsArray: User[] = [];
            for (const studentId of studentIds) {
                const response = await axiosInstance.get<User[]>(`/api/users/?pk=${studentId}`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    studentDetailsArray.push(response.data[0]);
                }
            }
            setStudentDetails(studentDetailsArray);
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    }, [axiosInstance]);

    const fetchCourseMaterials = useCallback(async () => {
        try {
            const response = await axiosInstance.get<CourseMaterial[]>(`/api/courses/${courseId}/materials/`);
            setCourseMaterials(response.data);
            setEnrollmentMessage(null); // Clear any previous enrollment messages
        } catch (error: any) {
            console.error('Error fetching course materials:', error);
            if (error.response && error.response.status === 403) {
                setEnrollmentMessage("You must be enrolled in this course to view materials.");
            } else {
                setEnrollmentMessage("Failed to load course materials.");
            }
            setCourseMaterials([]); // Clear materials on error
        }
    }, [courseId, axiosInstance]);

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
            if (courseId) {
                fetchCourse();
            }
            isMounted.current = true;
        }
    }, [courseId, fetchCourse]);

    useEffect(() => {
        if (course && course.students) {
            fetchStudentDetails(course.students);
        }
    }, [course, fetchStudentDetails]);

    useEffect(() => {
        if (courseId && !isMaterialMounted.current) {
            fetchCourseMaterials();
            isMaterialMounted.current = true;
        }
    }, [courseId, fetchCourseMaterials]);

    useEffect(() => {
        if (!isUserMounted.current) {
            fetchLoggedInUser();
            isUserMounted.current = true;
        }
    }, [fetchLoggedInUser]);

    // New function to handle course material creation
    const handleCreateCourseMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (newMaterialTextContent) {
                formData.append('text_content', newMaterialTextContent);
            }
            if (newMaterialFile) {
                formData.append('file', newMaterialFile);
            }

            await axiosInstance.post(`/api/courses/${courseId}/materials/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh course materials after creating
            fetchCourseMaterials();
            setNewMaterialTextContent('');
            setNewMaterialFile(null);
        } catch (error) {
            console.error('Error creating course material:', error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setNewMaterialFile(event.target.files[0]);
        }
    };

    if (loading) {
        return <div>Loading course details...</div>;
    }

    if (!course) {
        return <div>Course not found.</div>;
    }

    const isCourseCreator = loggedInUser && course.creator === loggedInUser.pk;
    const isEnrolled = loggedInUser && course.students.includes(loggedInUser.pk);

    return (
        <div>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <h3>Students:</h3>
            <ul>
                {studentDetails.map(student => (
                    <li key={student.pk}>{student.full_name} ({student.username})</li>
                ))}
            </ul>

            <h3>Course Materials:</h3>
            {enrollmentMessage && <p style={{ color: 'red' }}>{enrollmentMessage}</p>}
            {isEnrolled || isCourseCreator ? (
                <ul>
                    {courseMaterials.map(material => (
                        <li key={material.id}>
                            {material.text_content && <p>{material.text_content}</p>}
                            {material.file && <a href={material.file} target="_blank" rel="noopener noreferrer">View File</a>}
                            <p>Uploaded on: {new Date(material.upload_date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Enroll in this course to see the materials.</p>
            )}

            {/* Conditionally render the course material creation form */}
            {isCourseCreator && (
                <div>
                    <h2>Add New Course Material</h2>
                    <form onSubmit={handleCreateCourseMaterial}>
                        <div>
                            <label htmlFor="newMaterialTextContent">Text Content:</label>
                            <textarea
                                id="newMaterialTextContent"
                                value={newMaterialTextContent}
                                onChange={(e) => setNewMaterialTextContent(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="newMaterialFile">File:</label>
                            <input
                                type="file"
                                id="newMaterialFile"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit">Add Material</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CoursePage;
