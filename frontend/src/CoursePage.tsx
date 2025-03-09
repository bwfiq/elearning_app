import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from './useAxios';

interface Course {
    id: number;
    name: string;
    description: string;
    creator: number;
    students: number[];
}

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const axiosInstance = useAxios();

    // useRef to track if the component has mounted
    const isMounted = useRef(false);

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

    useEffect(() => {
        if (!isMounted.current) {
            if (courseId) {
                fetchCourse();
            }
            isMounted.current = true;
        }
    }, [courseId, fetchCourse]);

    if (loading) {
        return <div>Loading course details...</div>;
    }

    if (!course) {
        return <div>Course not found.</div>;
    }

    return (
        <div>
            <h2>{course.name}</h2>
            <p>{course.description}</p>
            <h3>Students:</h3>
            <ul>
                {course.students.map(studentId => (
                    <li key={studentId}>Student ID: {studentId}</li>
                ))}
            </ul>
        </div>
    );
};

export default CoursePage;
