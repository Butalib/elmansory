import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { IDashboard, IDashboardChart } from '../../../../core/interface/IDashboard';
import { DashboardService } from '../../../../core/service/dashboard.service';

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
export class DashbourdPage implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly topProductImage = 'assets/img/slidres/slidadd.png';

  readonly dashboardData = signal<IDashboard | null>(null);
  readonly statsCards = computed(() => this.dashboardData()?.statsCards ?? []);
  readonly products = computed(() => this.dashboardData()?.topProducts ?? []);
  readonly wheelData = computed(() => this.dashboardData()?.luckyWheel ?? null);
  readonly legendItems = computed(() => this.wheelData()?.legend ?? []);
  readonly chartOptions = computed<Partial<DashboardChartOptions>>(() =>
    this.createChartOptions(this.dashboardData()?.bookingChart)
  );

  ngOnInit(): void {
    this.dashboardService.loadAll().subscribe({
      next: (data) => this.dashboardData.set(data[0] ?? null),
      error: () => this.dashboardData.set(null),
    });
  }

  private createChartOptions(chartData?: IDashboardChart): Partial<DashboardChartOptions> {
    const values = chartData?.values ?? [];
    const categories = chartData?.categories ?? [];
    const highlightIndex = chartData?.highlightIndex ?? values.length - 1;

    return {
      series: [{ name: chartData?.seriesName ?? 'الحجوزات', data: values }],
      chart: {
        type: 'bar',
        height: 324,
        width: '100%',
        toolbar: { show: false },
        fontFamily: 'inherit',
        animations: {
          enabled: false,
          dynamicAnimation: {
            enabled: false,
          },
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },
      plotOptions: { bar: { borderRadius: 8, columnWidth: '66%', distributed: true } },
      dataLabels: { enabled: false },
      colors: values.map((_, index) => index === highlightIndex ? 'var(--color-primary-500)' : 'var(--color-primary-50)'),
      xaxis: {
        categories,
        labels: { rotate: 0, trim: true, style: { colors: 'var(--color-black-500)', fontSize: '0.625rem' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        opposite: true,
        min: 0,
        max: chartData?.max ?? 100,
        tickAmount: chartData?.tickAmount ?? 10,
        labels: { style: { colors: 'var(--color-black-800)', fontSize: '0.6875rem' } },
      },
      grid: { borderColor: 'var(--color-black-200)', strokeDashArray: 4, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
      legend: { show: false },
      tooltip: { y: { formatter: (value) => `${value} حجز` } },
    };
  }
}
