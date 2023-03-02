import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

  url = "https://localhost:7191/api/admin/products";
  urlUserArea = "https://localhost:7191/api/user/productuser";

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<ProductViewDto[]>(this.url);
  }

  getAllForUser() {
    return this.http.get<ProductViewDto[]>(this.urlUserArea);
  }

  getById(id: number) {
    return this.http.get<ProductViewDto>(`${this.url}/${id}`);
  }

  getByIdForUser(id: number) {
    return this.http.get<ProductViewDto>(`${this.urlUserArea}/${id}`);
  }

  create(product: ProductCreateDto | FormData) {
    return this.http.post<ProductCreateDto>(this.url, product);
  }

  delete(productId: number) {
    return this.http.delete(`${this.url}/${productId}`);
  }

  update(id: number, product: ProductCreateDto) {
    return this.http.put<ProductViewDto>(`${this.url}/${id}`, product);
  }
}
