import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import("./products/product-list/product-list.component").then((c) => c.ProductListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import("./products/new-product/new-product.component").then((c) => c.NewProductComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import("./products/edit-product/edit-product.component").then((c) => c.EditProductComponent)
    },
];
