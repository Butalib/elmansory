export interface ITeacher {
    id: string;
    name: string;
    avatar: string;
    levelId: string | number;
    levelName: string;
    subjectId: string | number;
    subjectName: string;
    reservedSessions: number;
    isActive: boolean;
}