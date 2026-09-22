import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlider } from '../../../../core/interface/ISlider';

@Component({
  selector: 'app-slide-cards',
  standalone: false,
  templateUrl: './slide-cards.html',
  styleUrl: './slide-cards.scss',
})
export class SlideCards {
  @Input({ required: true })
  slider!: ISlider;

  @Output()
  toggle = new EventEmitter<boolean>();

  @Output()
  delete = new EventEmitter<void>();
  @Output()
  edit = new EventEmitter<void>();
}
