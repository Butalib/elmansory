import { Component, signal } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

type DashboardChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashbourd-page',
  standalone: false,
  templateUrl: './dashbourd-page.html',
  styleUrl: './dashbourd-page.scss',
})
export class DashbourdPage {
  readonly statsCards = signal([
    { title: 'إجمالي الحجوزات', value: '2550', icon: 'assets/icon/dashbourd/statsCards/booking.svg' },
    { title: 'إجمالي عملاء جدد', value: '400', icon: 'assets/icon/dashbourd/statsCards/users.svg' },
    { title: 'إجمالي المبيعات', value: '2.48k', icon: 'assets/icon/dashbourd/statsCards/sales.svg' },
  ]);

  readonly products = signal([
    { name: 'شنطة مدرسية - ازرق', theme: 'bag-blue' },
    { name: 'شنطة مدرسية - ازرق', theme: 'bag-pink' },
    { name: 'شنطة مدرسية - ازرق', theme: 'bottle' },
    { name: 'شنطة مدرسية - ازرق', theme: 'case' },
    { name: 'شنطة مدرسية - ازرق', theme: 'books' },
  ]);

  readonly legendItems = [
    { value: '47.000', label: 'شاركوا مرة واحدة', className: 'hatched' },
    { value: '2000', label: 'لم يستخدموا العجلة بعد', className: 'light' },
    { value: '100.000', label: 'شاركوا 2-3 مرات', className: 'blue' },
    { value: '150.000', label: 'شاركوا أكثر من 3 مرات', className: 'gray' },
  ];

  readonly chartOptions: Partial<DashboardChartOptions> = {
    series: [{ name: 'الحجوزات', data: [55, 36, 55, 90, 42, 57, 72, 90, 37, 20] }],
    chart: { type: 'bar', height: 324, toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '66%', distributed: true } },
    dataLabels: { enabled: false },
    colors: ['#E2F6FD', '#E2F6FD', '#E2F6FD', '#E2F6FD', '#E2F6FD', '#E2F6FD', '#E2F6FD', '#00ADE9', '#E2F6FD', '#E2F6FD'],
    xaxis: {
      categories: ['أ/ ياسين حمزة', 'أ/ حسين حمزة', 'أ/ علي عبد الله', 'أ/ أحمد الجاف', 'أ/ منذر الفاتح', 'أ/ دانيار الجاف', 'أ/ حسين حمزة', 'أ/ قاسم علي', 'أ/ حسين حمزة', 'أ/ ياسين حمزة'],
      labels: { rotate: 0, trim: true, style: { colors: '#686868', fontSize: '0.625rem' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { opposite: true, min: 0, max: 100, tickAmount: 10, labels: { style: { colors: '#222', fontSize: '0.6875rem' } } },
    grid: { borderColor: '#E8E8E8', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    legend: { show: false },
    tooltip: { y: { formatter: (value) => `${value} حجز` } },
  };
}
