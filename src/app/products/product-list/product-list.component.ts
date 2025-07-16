import { Component, inject } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product-service/product.service';
import { BehaviorSubject, combineLatest, filter, map, Observable, share } from 'rxjs';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared-service/shared.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  private readonly productService: ProductService = inject(ProductService);
  private readonly sharedService: SharedService = inject(SharedService);
  private readonly router: Router = inject(Router);

  pageSizes: number[] = [5, 10, 20];
  itemsPerPage: number = 0;

  products$ = this.productService.getProducts().pipe(
    map(resp => resp.data)
  );
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private itemsPerPageSubject = new BehaviorSubject<number>(0);
  itemsPerPage$ = this.itemsPerPageSubject.asObservable();

  filteredProductos$: Observable<Product[]> = combineLatest([
    this.products$,
    this.searchTerm$
  ]).pipe(
    map(([productos, searchTerm]) => {
      const term = searchTerm.toLowerCase();
      return productos.filter((p: Product) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    })
  );

  pagintationProducts$: Observable<Product[]> = combineLatest([
    this.filteredProductos$,
    this.itemsPerPage$
  ]).pipe(
    map(([productos, itemsPerPage]) => productos.slice(0, itemsPerPage))
  );

  onSearch(term: string) {
    this.searchTermSubject.next(term);
  }

  changeItemsPerPage(count: number) {
    this.itemsPerPageSubject.next(count);
  }

  createProduct() {
    this.router.navigate(["/new"]);
  }

  editProduct(item: Product) {
    this.sharedService.selectedProduct = item;
    this.router.navigate([`/edit/${item.id}`]);
  }
}
