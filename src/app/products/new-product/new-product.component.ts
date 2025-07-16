import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service/product.service';
import { productExistsValidator, releaseDateValidator } from '../../validators/product.validator';
import { Product } from '../../models/product.interface';
import { InformationModalComponent, ModalOptions } from '../../components/modal/information-modal/information-modal.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InformationModalComponent, RouterModule],
  providers: [ProductService],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  productForm!: FormGroup;
  isOpened: boolean = false;

  modalOptions: ModalOptions = {
    header: "Producto creado correctamente",
    message: "El producto se ha registrado con éxito.",
    type: "info"
  }

  private readonly productService: ProductService = inject(ProductService);
  private readonly router: Router = inject(Router);
  private fBuilder: FormBuilder = inject(FormBuilder);


  constructor() {
    this.productForm = this.fBuilder.group({
      id: ["ABC12345",
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

  get f() {
    return this.productForm.controls;
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

  onReset() {
    this.productForm.reset();
  }

  onSubmit() {
    this.productForm.markAllAsTouched();
    this.productForm.markAsDirty();

    if (this.productForm.valid) {
      this.isOpened = true;
      console.log(this.productForm.value as Product);
      this.productService.createProduct(this.productForm.value as Product).subscribe();
    }

  }

  onCloseModal(event: boolean) {
    this.productForm.reset();
    this.isOpened = event;
    this.router.navigate([""]);
  }
}
