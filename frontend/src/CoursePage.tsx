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

    // useRef to track if the component has mounted
    const isMounted = useRef(false);
    const isMaterialMounted = useRef(false);

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
        } catch (error) {
            console.error('Error fetching course materials:', error);
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
                {studentDetails.map(student => (
                    <li key={student.pk}>{student.full_name} ({student.username})</li>
                ))}
            </ul>

            <h3>Course Materials:</h3>
            <ul>
                {courseMaterials.map(material => (
                    <li key={material.id}>
                        {material.text_content && <p>{material.text_content}</p>}
                        {material.file && <a href={material.file} target="_blank" rel="noopener noreferrer">View File</a>}
                        <p>Uploaded on: {new Date(material.upload_date).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoursePage;
