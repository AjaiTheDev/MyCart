import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})

export class UpdateProductComponent {

  productId: number;
  model = {
    categoryId: 0,
    name: '',
    brand: '',
    description: '',
    retailPrice: 0,
    offerPrice: 0,
    stock: 0
  };

  constructor(
    private services: ProductsService,
    private router: Router,
    private toaster: ToastrService,
    private route: ActivatedRoute) {
    this.productId = route.snapshot.params['id'];
  }

  ngOnInit() {
    if (this.productId == null) {
      return null;
    }
    this.services.getById(this.productId).subscribe({
      next: (result: any) => {
        var product = this.model;
        product.name = result.name;
        product.brand = result.brand;
        product.categoryId = result.category.id;
        product.description = result.description;
        product.retailPrice = result.price.retailPrice;
        product.offerPrice = result.price.offerPrice;
        product.stock = result.stock;
      },
      error: (errors) => {
        if (errors == 404) {
          this.toaster.error("Unable to fetch products at this moment", "product");
          return;
        }
        
      }
    });
    return true;
  }

  onSubmit() {
    this.services.update(this.productId, this.model).subscribe({
      next: (result: any) => {
        this.toaster.success("Details updated", "Product");
      },
      error: (result: any) => {
        this.toaster.success("Updation failed", "Product");
      }
    });
  }
}
