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
  // onInput(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   let currentValue = inputElement.value;

  //   if (this.restrictMode === 'numbersOnly') {
  //     // استبدل أي حاجة مش رقم بفراغ (امسحها)
  //     currentValue = currentValue.replace(/[^0-9]/g, '');
  //   } else if (this.restrictMode === 'englishOnly') {
  //     // استبدل أي حاجة مش حروف إنجليزي أو أرقام أو رموز اللينكات بفراغ (يمنع العربي)
  //     currentValue = currentValue.replace(/[^a-zA-Z0-9.:/_-]/g, '');
  //   }

  //   // لو اليوزر كتب حرف ممنوع وإتمسح، حدث الـ Input والـ FormControl بالقيمة النظيفة
  //   if (inputElement.value !== currentValue) {
  //     inputElement.value = currentValue;
  //     this.control.setValue(currentValue);
  //   }
  // }
}