import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IProfits } from '../../../core/interface/IProfits';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { IKpi } from '../../../core/interface/IKpi';
import { ProfitsSrvices } from '../../../core/service/profits.service';
import { Subscription } from 'rxjs';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';

@Component({
  selector: 'app-profits-page',
  standalone: false,
  templateUrl: './profits-page.html',
  styleUrl: './profits-page.scss',
})
export class ProfitsPage implements OnInit, OnDestroy {
  private profitsService = inject(ProfitsSrvices);
  private dataSubscription?: Subscription;


  tableColumns: ITableColumn[] = [
    { key: 'productName', label: 'اسم المنتج', type: 'user', imageKey: 'productImage' },
    { key: 'availableQuantity', label: 'الكمية المتاحة', type: 'text' },
    { key: 'originalPrice', label: 'السعر الاصلي', type: 'text' },
    { key: 'consumerPrice', label: 'السعر للمستهلك', type: 'text' },
    { key: 'ordersCount', label: 'عدد الطلبات', type: 'text' },
    { key: 'totalProfit', label: 'المكسب الإجمالي', type: 'text' },
    { key: 'netProfit', label: 'صافي الربح', type: 'text' }
  ];


  kpiStats: IKpi[] = [];


  readonly engine = new HybridQueryEngine<IProfits>(
    (query) => this.profitsService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.profitsService.items$,
    'local'
  );

  ngOnInit(): void {

    this.profitsService.loadAll().subscribe();


    this.dataSubscription = this.profitsService.items$.subscribe(data => {
      this.calculateKPIs(data);
    });
  }


  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onDateRangeChange(range: { startDate: string; endDate: string }): void {

    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate } as any);
  }

  onSortChange(direction: 'asc' | 'desc'): void {

    this.engine.patchQuery({ _sort: 'date', _order: direction });
  }

  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }


  private filterLocally(data: IProfits[], query: any): IProfits[] {
    return data.filter(item => {

      const matchSearch = query.searchTerm
        ? item.productName?.toLowerCase().includes(query.searchTerm.toLowerCase())
        : true;


      let matchDate = true;
      if (query.startDate && query.endDate && item.date) {
        const itemDate = new Date(item.date).getTime();
        const start = new Date(query.startDate).getTime();
        const end = new Date(query.endDate).getTime();

        matchDate = itemDate >= start && itemDate <= end;
      }


      return matchSearch && matchDate;
    });
  }

  private calculateKPIs(data: IProfits[]): void {
    const totalProducts = data.length;


    const totalProfitsCalc = data.reduce((sum, item) => sum + (item.netProfit || 0), 0);

    const totalSalesCalc = data.reduce((sum, item) => sum + (item.ordersCount || 0), 0) * 2500;

    this.kpiStats = [
      { id: '1', title: 'إجمالي المنتجات', value: totalProducts.toString(), icon: 'assets/icon/profit/products.svg', iconBgColor: 'var(--color-primary-50)' },
      { id: '2', title: 'إجمالي المبيعات', value: `${totalSalesCalc.toLocaleString()} د.ع`, icon: 'assets/icon/profit/sales.svg', iconBgColor: 'var(--color-primary-50)' },
      { id: '3', title: 'إجمالي الأرباح', value: `${totalProfitsCalc.toLocaleString()} د.ع`, icon: 'assets/icon/profit/profits.svg', iconBgColor: 'var(--color-black-100)' }
    ];
  }

  ngOnDestroy(): void {
    this.engine.destroy();
    this.dataSubscription?.unsubscribe();
  }
}