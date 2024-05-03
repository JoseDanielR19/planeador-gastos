import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SwitchService } from '../services/switch.service';
import { Expense } from '../models/expense';
import { ExpenseService } from '../services/expense-service.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  expense: Expense = { id: 0, nameExpend: '', priceExpend: "" };

  constructor(
    private modalSS: SwitchService,
    private expenseService: ExpenseService
  ) {}

  saveExpense() {
    if (this.expense.id) {
      // Si el gasto tiene un ID, actualiza el gasto existente
      this.expenseService.updateExpense(this.expense);
    } else {
      // Si no hay ID, significa que es un nuevo gasto
      this.expense.id = new Date().getTime(); // Genera un ID único para el nuevo gasto
      this.expenseService.addExpense(this.expense);
    }

    // Actualiza el total de gastos
    this.expenseService.updateTotalGastos(this.expense.priceExpend);

    // Cierra el modal y reinicia el objeto expense
    this.closeModal();
    this.expense = { id: 0, nameExpend: '', priceExpend: 0 };
  }

  ngOnInit() {
    // Intenta obtener un gasto seleccionado para actualizar
    const selectedExpense = this.expenseService.getSelectedExpense();
    if (selectedExpense) {
      // Si hay un gasto seleccionado, usa ese para la actualización
      this.expense = { ...selectedExpense };
    }
  }

  closeModal() {
    this.modalSS.$modal.emit(false);
    window.location.reload();
  }

  onSubmit() {
    this.saveExpense();
  }
}
