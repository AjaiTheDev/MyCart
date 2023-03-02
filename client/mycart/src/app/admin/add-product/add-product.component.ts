import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  categories: CategoryViewDto[] = [];
  formData = new FormData();

  model: ProductCreateDto = {
    categoryId: null,
    name: '',
    brand: '',
    description: '',
    retailPrice: null,
    offerPrice: null,
    stock: null
  };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductsService,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(form: any): void {
    this.categoryService.getAll().subscribe({
      next: (result: any) => {
        this.categories = result;
      }
    });
  }

  // onSubmit(productform: any) {
  //   this.productService.create(this.model).subscribe({
  //     next: (response: any) => {

  //       if (response.isValid) {
  //         this.toaster.success("Product is Created");
  //         productform.reset();
  //       } else {
  //         this.toaster.error("Product Details are not valid, check again");
  //       }

  //     },
  //     error: (errors: any) => {
  //       if (errors != null) {
  //         this.toaster.error("something went wrong");
  //       }

  //     }
  //   })
  // }

  onSubmit() {    
    this.formData.append("categoryId", this.model.categoryId!.toString());
    this.formData.append("name", this.model.name);
    this.formData.append("description", this.model.description);
    this.formData.append("brand", this.model.brand);
    this.formData.append("retailPrice", this.model.retailPrice!.toString());
    this.formData.append("offerPrice", this.model.offerPrice!.toString());
    this.formData.append("stock", this.model.stock!.toString());

    this.productService.create(this.formData).subscribe({
      next: () => {
        alert("Product created successfully");
        return this.router.navigate(['admin', 'products']);
      },
      error: (error) => {
        console.error(error);
        alert("Error creating product");
      }
    })
  }

  fileSelected(e: any) {
    const file: File = e.target.files[0];
    if (file) {
      this.formData.append("image", file, file.name);
    }
  }

}
