import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Router, RouterModule } from '@angular/router';
import { TokenHelper } from 'src/Utlis/Helpers/TokenHelper';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HomePageComponent {

  products: ProductViewDto[] | null = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    this.productsService.getAllForUser().subscribe({
      next: (response: any) => {
        this.products = response.result;
      }
    });
  }
}

