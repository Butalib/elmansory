import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing-module';
import { ProductsPage } from './products-page/products-page';

@NgModule({
  declarations: [ProductsPage],
  imports: [CommonModule, ProductsRoutingModule],
})
export class ProductsModule {}
