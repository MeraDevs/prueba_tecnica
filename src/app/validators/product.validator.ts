import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, of, debounceTime, switchMap, map, catchError } from "rxjs";
import { ProductService } from "../services/product-service/product.service";

export function productExistsValidator(bankService: ProductService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const id = control.value;
        if (!id) return null;

        return of(control.value).pipe(
            debounceTime(500),
            switchMap(() =>
                bankService.productExists(id).pipe(
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

export function revisionDateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const release = group.get("date_release")?.value;
        const revision = group.get("date_review")?.value;

        if (!release || !revision) return null;

        const releaseDate = new Date(release);
        const revisionDate = new Date(revision);

        const expectedRevision = new Date(releaseDate);
        expectedRevision.setFullYear(releaseDate.getFullYear() + 1);
        expectedRevision.setHours(0, 0, 0, 0);
        revisionDate.setHours(0, 0, 0, 0);

        return revisionDate.getTime() !== expectedRevision.getTime() ? { revisionDateInvalid: true } : null;
    }
}
