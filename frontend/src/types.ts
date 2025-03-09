// frontend/src/types.ts
export interface CourseMaterial {
    id: number;
    course: number;
    uploaded_by: number | null;
    uploaded_by_username: string | null;
    text_content: string;
    file: string | null;
    upload_date: string;
}

export interface CourseFeedback {
    id: number;
    user: string;
    text: string;
    timestamp: string;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    creator: number;
    students: number[];
    creator_username: string; // Add creator_username
}

export interface Notification {
    id: number;
    user: number;
    message: string;
    timestamp: string;
    is_read: boolean;
}
