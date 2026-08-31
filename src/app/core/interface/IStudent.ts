export interface IStudent {
    id: string;
    name: string;
    email?: string;
    phone: string;
    birthDate: Date | string;
    joinDate: Date | string;
    isActive: boolean;


    levelId?: string | number;
    levelName?: string;
    avatar?: string;
    ordersCount: number;
    wheelUses: number;
}