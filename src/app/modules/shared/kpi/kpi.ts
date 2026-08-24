import { Component, Input } from '@angular/core';
import { IKpi } from '../../../core/interface/IKpi';

@Component({
  selector: 'app-kpi',
  standalone: false,
  templateUrl: './kpi.html',
  styleUrl: './kpi.scss',
})
export class Kpi {
  @Input() stats: IKpi[] = [];
}
