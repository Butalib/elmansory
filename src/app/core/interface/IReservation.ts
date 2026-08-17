export interface ReservationTableRow {
    id: string;
    code: string;
    studentName: string;
    governorateId: string;
    regionId: string;
    subjectId: string;
    phoneNumber: string;
    teacherId: string;
    telegramLink: string;
    isActive?: boolean;
    createdAt: string;
}
