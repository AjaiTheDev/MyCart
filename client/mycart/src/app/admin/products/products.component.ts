import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  products: ProductViewDto[] = [];
  faTrash = faTrash as IconProp;

  constructor(private service: ProductsService,
    private router: Router) { }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (response: any) => {
        this.products = response.result;
      }
    });
  }

  edit(productId: number) {
    this.router.navigate(['/admin/products/update/', productId]);
  }

  Delete(productId: number) {
    let decision = confirm("Are you sure you want to delete it ?");

    if (decision) {
      this.service.delete(productId).subscribe({
        next: (response: any) => {
          this.ngOnInit();
        }

      });
    }
  }
}
