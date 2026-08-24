export type CellType = 'text' | 'toggle' | 'actions' | 'date' | 'badge' | 'user';

export interface ITableAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}
export interface IBadgeConfig {
  [key: string]: {
    text: string;
    bgColor: string;
    textColor: string;
  };
}

export interface ITableColumn {
  key: string;
  label: string;
  type: CellType;
  actions?: ITableAction[];
  badgeConfig?: IBadgeConfig;
  hasToggle?: boolean;
  toggleKey?: string;
  imageKey?: string;
}