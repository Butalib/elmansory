import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-componant',
  standalone: false,
  templateUrl: './layout-componant.html',
  styleUrl: './layout-componant.scss',
})
export class LayoutComponant implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    // console.log(this.router.url);
  }
}
