import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderStateService } from '../../../../core/service/header-state.service';

type ContactMethodType = 'phone' | 'instagram' | 'tiktok' | 'facebook' | 'telegram';

interface ContactMethod {
  id: string;
  type: ContactMethodType;
  value: string;
}

@Component({
  selector: 'app-contact-methods-page',
  standalone: false,
  templateUrl: './contact-methods-page.html',
  styleUrl: './contact-methods-page.scss',
})
export class ContactMethodsPage implements OnInit, OnDestroy {
  private readonly headerState = inject(HeaderStateService);
  private searchSub?: Subscription;

  readonly contactMethods: ContactMethod[] = [
    {
      id: 'phone',
      type: 'phone',
      value: '01550806171',
    },
    {
      id: 'instagram',
      type: 'instagram',
      value: 'ahmedk12m3',
    },
    {
      id: 'tiktok',
      type: 'tiktok',
      value: 'Butalib',
    },
    {
      id: 'facebook',
      type: 'facebook',
      value: 'Mesh Ahmed Kamal',
    },
    {
      id: 'telegram',
      type: 'telegram',
      value: 'Butallib',
    },
  ];

  filteredContactMethods = [...this.contactMethods];

  ngOnInit(): void {
    this.searchSub = this.headerState.search$.subscribe((term) => {
      this.filterContactMethods(term);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  getContactLabel(type: ContactMethodType): string {
    const labels: Record<ContactMethodType, string> = {
      phone: 'رقم الهاتف',
      instagram: 'انستجرام',
      tiktok: 'تيك توك',
      facebook: 'فيسبوك',
      telegram: 'تليجرام',
    };

    return labels[type];
  }

  getContactIcon(type: ContactMethodType): string {
    const icons: Record<ContactMethodType, string> = {
      phone: 'assets/icon/contact/Component 6 (8).svg',
      instagram: 'assets/icon/contact/skill-icons_instagram.svg',
      tiktok: 'assets/icon/contact/tiktok.svg',
      facebook: 'assets/icon/contact/Facebook.svg',
      telegram: 'assets/icon/contact/telegram.svg',
    };

    return icons[type];
  }

  private filterContactMethods(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      this.filteredContactMethods = [...this.contactMethods];
      return;
    }

    this.filteredContactMethods = this.contactMethods.filter((method) =>
      method.value.toLowerCase().includes(normalizedTerm) ||
      this.getContactLabel(method.type).toLowerCase().includes(normalizedTerm),
    );
  }
}
