// frontend/src/CourseList.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAxios from './useAxios';
import { Course } from './types';

const CourseList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const axiosInstance = useAxios();
    const [loading, setLoading] = useState(true);
    const fetchCoursesRef = useRef(false);

    const fetchCourses = useCallback(async () => {
        try {
            const response = await axiosInstance.get<Course[]>('/api/courses/');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    }, [axiosInstance]);

    useEffect(() => {
        if (!fetchCoursesRef.current) {
            setLoading(true);
            fetchCourses();
            fetchCoursesRef.current = true;
        }
    }, [fetchCourses]);

    if (loading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div>
            <h2>Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/courses/${course.id}`}>{course.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseList;
