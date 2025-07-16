import { inject, Injectable } from '@angular/core';
import { Product } from '../../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _selectedProduct: Product | null = null;

  set selectedProduct(product: Product) {
    this._selectedProduct = product;
  }

  get selectedProduct(): Product | null {
    return this._selectedProduct;
  }

  clear() {
    this._selectedProduct = null;
  }

}
