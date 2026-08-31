export interface IDashboardStatCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
}

export interface IDashboardChart {
  title: string;
  seriesName: string;
  values: number[];
  categories: string[];
  highlightIndex?: number;
  max?: number;
  tickAmount?: number;
}

export interface IDashboardProduct {
  id: string;
  name: string;
  price: string;
  soldLabel: string;
  statusLabel: string;
  theme: string;
}

export interface IDashboardWheelSegment {
  id: string;
  value: string;
  label: string;
  className: string;
}

export interface IDashboardWheel {
  title: string;
  periodLabel: string;
  totalLabel: string;
  totalValue: string;
  legend: IDashboardWheelSegment[];
}

export interface IDashboard {
  id: string;
  statsCards: IDashboardStatCard[];
  bookingChart: IDashboardChart;
  topProductsTitle: string;
  topProducts: IDashboardProduct[];
  luckyWheel: IDashboardWheel;
}
