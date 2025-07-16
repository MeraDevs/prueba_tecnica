import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { Product } from '../../../models/product.interface';

export interface ModalOptions {
  header: string,
  message: string,
  type: "info" | "warning" | "error" | "accept",
  data?: Product
}

@Component({
  selector: 'app-information-modal',
  standalone: true,
  imports: [],
  templateUrl: './information-modal.component.html',
  styleUrl: './information-modal.component.css'
})
export class InformationModalComponent {

  @Input() isOpened!: boolean;
  @Input() modalOptions!: ModalOptions

  @Output() showModal = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<boolean>();

  onCancel() {
    this.onCloseModal();
  }

  onConfirm() {
    this.confirm.emit(false);
  }

  onCloseModal() {
    this.showModal.emit(false);
  }
}
