import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminNavbarComponent } from './shared/admin-navbar/admin-navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddProductComponent } from './add-product/add-product.component';
import { FormsModule } from '@angular/forms';
import { ViewFeedbackComponent } from './view-feedback/view-feedback.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NgbDropdownModule, NgbToast, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ProductsComponent } from './products/products.component';
import { FeedbackItemComponent } from './shared/feedback-item/feedback-item.component';
import { AddCategoriesComponent } from './add-categories/add-categories.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminLayoutComponent,
    AdminNavbarComponent,
    AddProductComponent,
    ViewFeedbackComponent,
    AddCategoriesComponent,
    DropdownComponent,
    UpdateProductComponent,
    ProductsComponent,
    FeedbackItemComponent,
    ViewOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FontAwesomeModule,
    FormsModule,
    FooterComponent,
    NgbDropdownModule,
    NgSelectModule,
  ]
})
export class AdminModule { }
