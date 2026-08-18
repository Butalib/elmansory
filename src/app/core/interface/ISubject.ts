export interface ISubject {
    id: string | number;
    name: string;
    createdAt: string | Date;
    isActive: boolean;
    icon?: string;
}