export type NotebookStatus = 'available' | 'unavailable' | 'lowStock';

export interface INotebook {
  id: string | number;
  name: string;
  imageUrl?: string;
  teacherId?: string | number;
  teacherName: string;
  levelId?: string | number;
  levelName: string;
  subjectId?: string | number;
  subjectName: string;
  price: number;
  discountPercentage?: number;
  quantity: number;
  status: NotebookStatus;
  isActive: boolean;
  isFeatured: boolean;
  isSchoolReady: boolean;
  createdAt: string | Date;
}
