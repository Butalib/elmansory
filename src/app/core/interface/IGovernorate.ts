export interface IGovernorate {
    id: string; // أو number حسب الباك إند
    name: string;
    regionsCount: number; // عدد المناطق
    addedAt: string;
    isActive: boolean; // للزرار بتاع التفعيل/التعطيل (Toggle)
}
