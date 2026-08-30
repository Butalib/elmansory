import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderStateService } from '../../../../../core/service/header-state.service';
import { GovernorateModal } from '../governorate-modal/governorate-modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-governorate-page',
  standalone: false,
  templateUrl: './governorate-page.html',
  styleUrl: './governorate-page.scss',
})
export class GovernoratePage implements OnInit, OnDestroy {
  private actionSub!: Subscription;


  constructor(
    private headerState: HeaderStateService,
    // private modalCtrl: ModalController,
    private toaster: ToastrService
  ) { }

  ngOnInit() {
    // 1. نبعت الكونفج للهيدر عشان يظهر زرار "إضافة محافظة"
    this.headerState.setConfig({
      title: 'المحافظات',
      showButton: true,
      buttonText: 'إضافة محافظة جديدة',
      showSearch: true,
      showFilterButton: false,
      showDate: false
    });

    // 2. نسمع الكليك اللي جاي من الهيدر (عبر الوسيط)
    // this.actionSub = this.headerState.action$.subscribe(() => {
    //   this.openAddModal();
    // });
  }

  // دالة فتح المودال
  // async openAddModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: GovernorateModal,
  //     cssClass: 'add-governorate-modal form-modal'
  //   });

  //   await modal.present();

  //   const result = await modal.onDidDismiss();
  //   if (result.data) {
  //     console.log('تم إضافة محافظة:', result.data);
  //   }
  // }

  ngOnDestroy() {
    if (this.actionSub) {
      this.actionSub.unsubscribe();
    }
  }
}
