import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-switch',
  standalone: false,
  templateUrl: './btn-switch.html',
  styleUrl: './btn-switch.scss',
})
export class BtnSwitch {
  @Input() checked = false;

  @Output() toggle = new EventEmitter<boolean>();

  onToggle(): void {
    this.toggle.emit(!this.checked);
  }


}
