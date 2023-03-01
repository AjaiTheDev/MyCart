import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {

  cartItems: CartViewDto[] | null = [];

  model = {
    deliveryAddress: '',
    totalPrice: 0
  }

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.getAll().subscribe({
      next: (response: any) => {
        this.cartItems = response.result;
        this.cartItems?.forEach((m: any) => {
          this.model.totalPrice += m.product.price.offerPrice;
        })
      }
    });
  }

  onSubmit() {
    this.orderService.postOrders(this.model).subscribe({
      next: (response: any) => {
        if (!response.isvalid) {
          this.toaster.success("Order placed Succesfully");
          this.router.navigate(['/customer/order/view']);
        } else {
          this.toaster.success("Order Failed, Try again");
        }
      }
    });
  }
}
