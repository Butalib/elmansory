export type CellType = 'text' | 'toggle' | 'actions';

export interface ITableAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export interface ITableColumn {
  key: string;
  label: string;
  type: CellType;
  actions?: ITableAction[];
}
