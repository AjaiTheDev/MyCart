import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})

export class CartItemComponent {

  @Input() cartItem: any;
  productQuantity: number = 1;
  faTrash = faTrash as IconProp;

  // @Output("delete") delete = new EventEmitter<number>();

  constructor(private cartService: CartService) {
  }

  updateQuantity(e: MouseEvent) {
    let target = e.target as HTMLOptionElement;
    let option = target.getAttribute("data-action");

    if (option === 'sub' && this.productQuantity === 1) {
      return;
    }

    if (option === 'add' && this.productQuantity === 5) {
      return;
    }

    this.productQuantity += option === 'add' ? 1 : -1;
  }

  deleteItem(cartId: number) {
    let decision = confirm("Are you sure you want to delete it ?");
    
    if(decision) {
      this.cartService.delete(cartId).subscribe({
        next: () => {
          window.location.reload();
        }
      });
    }
  }
}
