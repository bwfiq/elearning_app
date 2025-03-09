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
