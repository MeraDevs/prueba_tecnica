import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.interface';

@Injectable({
  providedIn: 'root',

})
export class ProductService {

  private baseUrl: string = "/api/bp/products"

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getProducts(): Observable<any> {
    return this._httpClient.get(this.baseUrl);
  }

  productExists(id: number | string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/verification/${id}`);
  }

  createProduct(product: Product) {
    return this._httpClient.post(this.baseUrl, product);
  }

  updateProduct(id: number | string, product: Product) {
    return this._httpClient.put(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number | string) {
    return this._httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
