export interface ISidebarItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: ISidebarItem[];
}
