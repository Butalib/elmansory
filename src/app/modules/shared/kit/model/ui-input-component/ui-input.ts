import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  standalone: false,
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.scss',
})
export class UiInput {

  // Configuration || ui 
  @Input() control?: FormControl | any;

  @Input() type: 'text' | 'tel' | 'email' | 'number' | 'url' | 'password' | string = 'text';
  @Input() restrictMode?: 'numbersOnly' | 'englishOnly';

  @Input() placeholder = '';

  @Input() icon = '';

  @Input() value = '';

  @Input() disabled = false;

  // Events

  @Output() valueChange = new EventEmitter<string>();

  get inputValue(): any {
    return this.control ? this.control.value : this.value;
  }

  get isDisabled(): boolean {
    return this.control ? this.control.disabled : this.disabled;
  }

  // User Interaction
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (this.control) {
      this.control.setValue(input.value);
      this.control.markAsTouched();
    } else {
      this.valueChange.emit(input.value);
    }
  }
}