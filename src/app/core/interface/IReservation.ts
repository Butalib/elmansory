export interface ReservationTableRow {
    id: string;
    code: string;
    studentName: string;
    governorate: string;
    region: string;
    phone: string;
    teacherName: string;
    telegramLink: string;
    isActive?: boolean;
    createdAt: string;
}
