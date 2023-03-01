import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent {

  orderProducts: OrderViewDto[] | null = null;

  constructor(private orderService: OrderService) {
  }

  ngOnInit() {
    this.orderService.getAllForAdmin().subscribe({
      next: (response: any) => {
        this.orderProducts = response.result;
      }
    });
  }
}
