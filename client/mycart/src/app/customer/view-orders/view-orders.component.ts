import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-view-orders-customer',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent {

  orderProducts: OrderViewDto[] | null = null;
  notEmpty: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.getForCustomers().subscribe({
      next: (response: any) => {
        this.orderProducts = response.result;
        if (response.result != null) {
          this.notEmpty = true;
        }       
      }
    });
  }

}
