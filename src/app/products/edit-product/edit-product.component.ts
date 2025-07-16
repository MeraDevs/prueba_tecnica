import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service/product.service';
import { productExistsValidator, releaseDateValidator } from '../../validators/product.validator';
import { Product } from '../../models/product.interface';
import { InformationModalComponent, ModalOptions } from '../../components/modal/information-modal/information-modal.component';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { SharedService } from '../../services/shared-service/shared.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InformationModalComponent, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  product: Product | null = null;
  productForm!: FormGroup;
  isOpened: boolean = false;

  modalOptions!: ModalOptions

  private readonly productService: ProductService = inject(ProductService);
  private readonly sharedService: SharedService = inject(SharedService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private fBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.productForm = this.fBuilder.group({
      id: [{ value: "", disabled: true },
      {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [productExistsValidator(this.productService)],
        updateOn: 'blur'
      }
      ],
      name: ["CREDIT CARD",
        {
          validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
          updateOn: 'blur'
        }
      ],
      description: ["CREDIT CARD FOR STUDENTS",
        {
          validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
          updateOn: 'blur'
        }
      ],
      logo: ["XXXXXXX", [Validators.required]],
      date_release: ["",
        {
          validators: [Validators.required, releaseDateValidator()]
        }
      ],
      date_revision: ["",
        {
          validators: [Validators.required]
        }
      ],
    });
  }

  ngOnInit(): void {
    this.product = this.sharedService.selectedProduct;

    if (!this.product) {
      this.router.navigate([""]);
      return
    }
    this.populateForm(this.product);
  }

  get f() {
    return this.productForm.controls;
  }

  populateForm(product: Product) {
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logo,
      date_release: product.date_release,
      date_revision: product.date_revision,
    });
  }

  onDateReleaseChange(event: any) {
    const releaseDate = new Date(event.target.value);
    const nextYear = releaseDate.getFullYear() + 1;
    const revisionDate = new Date(nextYear, releaseDate.getMonth(), releaseDate.getDate());

    const yyyy = revisionDate.getFullYear();
    const mm = String(revisionDate.getMonth() + 1).padStart(2, "0");
    const dd = String(revisionDate.getDate()).padStart(2, "0");
    const dateString = `${yyyy}-${mm}-${dd}`;

    this.f["date_revision"].setValue(dateString);
    this.f["date_revision"].markAsDirty();
    this.f["date_revision"].markAsTouched();
  }

  onDelete() {
    if (!this.product) return;

    this.modalOptions = {
      header: "Eliminar registro",
      message: `¿Está seguro que quiere eliminar el producto ${this.product.name}?`,
      type: "warning",
      data: this.product
    };

    this.isOpened = true;
  }

  onSubmit() {
    this.productForm.markAllAsTouched();
    this.productForm.markAsDirty();

    if (this.productForm.valid) {
      this.modalOptions = {
        header: "Actualizar Producto",
        message: `Producto actualizado correctamente`,
        type: "info",
      };
      const id = this.product!.id;
      const productUpdated = this.productForm.value as Product;

      this.productService.updateProduct(id, productUpdated).subscribe({
        next: (response) => {
          console.log("Producto actualizado:", response);
          this.isOpened = true;
        },
        error: (err) => {
          console.error("Error al actualizar producto:", err);
        }
      });
    }
  }

  onConfirmDelete(event: boolean) {
    
    this.isOpened = false;
    console.log(event);
    console.log(this.product);
    if (this.product) {
      this.router.navigate([""]);

      this.productService.deleteProduct(this.product.id).subscribe();
    }
  }

  onCloseModal(event: boolean) {
    this.isOpened = false;
    this.router.navigate([""]);


    if (event && this.product) {
      console.log(event);
      console.log(this.product);

      this.productService.deleteProduct(this.product.id).subscribe();
    }
  }

}
