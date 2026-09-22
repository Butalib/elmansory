import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ui-image-upload',
  standalone: false,
  templateUrl: './ui-image-upload-component.html',
  styleUrl: './ui-image-upload-component.scss'
})
export class UiImageUploadComponent implements OnChanges {

  private cdr = inject(ChangeDetectorRef);
  private toaster = inject(ToastrService);

  @Input() isOpen = false;
  @Input() existingImageUrl: string | null = null;

  @Output() fileSelected = new EventEmitter<string | null>();

  previewUrl: string | null = null;
  isDragging = false;

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !this.isOpen) {
      this.resetLocalState();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.toaster.error('الرجاء اختيار صورة صالحة');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.previewUrl = reader.result;
        this.cdr.detectChanges();

        this.fileSelected.emit(this.previewUrl);
      }
    };

    reader.readAsDataURL(file);
  }

  get displayUrl(): string | null {
    return this.previewUrl || this.existingImageUrl;
  }

  clearImage(event: Event): void {
    event.stopPropagation();

    this.previewUrl = null;
    this.existingImageUrl = null;

    this.clearFileInput();

    this.fileSelected.emit(null);
  }

  private resetLocalState(): void {
    this.previewUrl = null;
    this.isDragging = false;
    this.clearFileInput();
  }

  private clearFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}