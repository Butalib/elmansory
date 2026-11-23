import { Component, OnInit, inject, signal } from '@angular/core';
import { ServerStatusService } from './core/services/server-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly serverStatus = inject(ServerStatusService);
  protected readonly title = signal('el-mansory');

  ngOnInit(): void {
    this.serverStatus.warmup();
  }
}
