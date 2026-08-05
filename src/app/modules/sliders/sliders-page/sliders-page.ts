import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ISlider } from '../../../core/interface/ISlider';
import { SliderService } from '../../../core/service/slider.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sliders-page',
  standalone: false,
  templateUrl: './sliders-page.html',
  styleUrl: './sliders-page.scss',
})

export class SlidersPage implements OnInit {
  private sliderService = inject(SliderService);
  sliders$ = this.sliderService.items$;
  // sliders: ISlider[] = [];

  // sliders$ = Observable<ISlider[]>;
  constructor(
    // private sliderService: SliderService,
    // private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    //method 2
    this.sliderService
      .loadAll().subscribe();
  }
  // ngOnInit(): void {
  //   console.log("SlidersPage init run ");
  //   //method 2
  //   this.sliderServices
  //     .loadAll().subscribe();

  //   // 1. بنـ Subscribe الأول عشان نسمع الداتا
  //   this.sliderService.items$.subscribe({
  //     next: (sliders) => {
  //       console.log("Sliders data received:", sliders);
  //       this.sliders = sliders;
  //       this.cdr.detectChanges(); // عشان نضمن إن التغييرات اتطبقت
  //     }
  //   });

  //   // 2. بنعمل الـ Request وبنضيف Error Handler عشان لو فشل نعرف السبب
  //   this.sliderService.loadAll().subscribe({
  //     next: () => {
  //       console.log("Data fetched successfully");
  //     },
  //     error: (err) => {
  //       // 🚨 السطر ده هو اللي هيكشفلك المشكلة الحقيقية في الـ Console
  //       console.error("Error fetching sliders on refresh:", err);
  //     }
  //   });
  // }
  onDelete(slider: ISlider): void {
    console.log(slider);
  }
  onEdit(slider: ISlider): void {
    console.log(slider);
  }
  onToggle(
    slider: ISlider,
    checked: boolean
  ): void {
    console.log(slider, checked);
  }
}
