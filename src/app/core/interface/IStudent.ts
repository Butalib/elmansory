export interface IStudent {
    id: string;
    name: string;
    email?: string; // خليناه اختياري لو مش دايماً مطلوب
    phone: string;
    birthDate: Date | string; // ممكن يجي كـ string من الـ API
    joinDate: Date | string;
    isActive: boolean;

    // الخصائص اللي كانت ناقصة وعاملة الإيرور
    levelId?: string | number;
    levelName?: string;
    avatar?: string;
    ordersCount: number;
    wheelUses: number;
}