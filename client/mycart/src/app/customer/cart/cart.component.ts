import { Component, EventEmitter, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCartFlatbedSuitcase } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  faCart = faCartFlatbedSuitcase as IconProp;
  cartItems: CartViewDto[] | null = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService,
    private productService: ProductsService
  ) {
  }

  ngOnInit() {
    this.cartService.getAll().subscribe({
      next: (response: any) => {
        this.cartItems = response.result;
        this.cartItems?.forEach((m: any) => {
          this.totalAmount += m.product.price.offerPrice;
        })
      }
    });
  }

}
