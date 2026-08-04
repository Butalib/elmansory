import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-slide-cards',
  standalone: false,
  templateUrl: './slide-cards.html',
  styleUrl: './slide-cards.scss',
})
export class SlideCards {

  slider: any;
  toggle = new EventEmitter<boolean>();
  onDelete = new EventEmitter<void>();
}
