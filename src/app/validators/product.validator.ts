import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of, debounceTime, switchMap, map, catchError } from "rxjs";
import { ProductService } from "../services/product-service/product.service";

export function productExistsValidator(productService: ProductService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const id = control.value;
        if (!id) return null;

        return of(control.value).pipe(
            debounceTime(500),
            switchMap(() =>
                productService.productExists(id).pipe(
                    map((response) => (response ? { productExists: true } : null)),
                    catchError(() => of(null))
                )
            )
        );
    }
}

export function releaseDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const inputDate = new Date(value);
        const today = new Date();
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return inputDate < today ? { releaseDateInvalid: true } : null;
    }
}
