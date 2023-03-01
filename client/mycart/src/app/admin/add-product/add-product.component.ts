import { Component } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  constructor(
    private categoryService: CategoryService,
    private productService: ProductsService,
    private toaster: ToastrService
  ) { }

  categories: CategoryViewDto[] = [];

  model: ProductCreateDto = {
    categoryId: null,
    name: '',
    brand: '',
    description: '',
    retailPrice: null,
    offerPrice: null,
    stock: null
  };


  ngOnInit(form: any): void {
    this.categoryService.getAll().subscribe({
      next: (result: any) => {
        this.categories = result;
      }
    });
  }

  onSubmit(productform: any) {
    this.productService.create(this.model).subscribe({
      next: (response: any) => {
        
        if (response.isValid) {
          this.toaster.success("Product is Created");
          productform.reset();
        } else {
          this.toaster.error("Product Details are not valid, check again");
        }

      },
      error: (errors: any) => {
        if (errors != null) {
          this.toaster.error("something went wrong");
        }

      }
    })
  }
}
