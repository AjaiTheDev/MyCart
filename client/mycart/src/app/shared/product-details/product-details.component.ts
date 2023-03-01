import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  productId: number;
  hasToken: boolean = true;

  model = {
    categoryId: 0,
    name: '',
    brand: '',
    description: '',
    retailPrice: 0,
    offerPrice: 0,
    stock: 0
  };

  cartProduct = {
    productId: 0
  }

  constructor(private service: ProductsService,
    private cartService: CartService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private toaster: ToastrService,
    private route: ActivatedRoute) {
    this.productId = route.snapshot.params['id'];
  }


  ngOnInit(): void {
    this.service.getByIdForUser(this.productId).subscribe({
      next: (result: any) => {
        this.cartProduct.productId = this.productId
        this.model.name = result.name;
        this.model.description = result.description;
        this.model.brand = result.brand;
        this.model.offerPrice = result.price.offerPrice;
        this.model.retailPrice = result.price.retailPrice;
      }
    });
  }

  AddToCart() {
    let loggedIn = this.tokenHelper.hasToken();
    if(loggedIn){
      this.cartService.Create(this.cartProduct).subscribe({
        next: (response: any) => {
          if (response.result) {
            this.toaster.success("product is added to your cart");
          }
        },
        error: (errors: any) => {
          if (errors.status == 500) {
            this.toaster.info("Product already exists in the cart");
          }
        }
      });
    }else {
      this.toaster.info("Sorry, You are not logged in");
      this.router.navigate(['/login']);
    }
    
  }

  orderSummary() {
    this.router.navigate(['customer/order/summary']);
  }
}
