import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { SwitchService } from '../services/switch.service';
import { Expense } from '../models/expense';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../services/expense-service.service';
import { BudgetServiceService } from '../services/budget-service.service';
import { Budget } from '../models/Budget';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-manager',
  standalone: true,
  imports: [ModalComponent, CommonModule, FormsModule],
  templateUrl: './expense-manager.component.html',
  styleUrls: ['./expense-manager.component.css'],
})
export class ExpenseManagerComponent {
  modalVisible: boolean = false;
  expenses: Expense[] = [];
  selectedExpense: Expense | null = null;
  totalGastos: number = 0; // Agrega la variable para el total de gastos

  constructor(
    private modalSS: SwitchService,
    private expenseService: ExpenseService,
    private budgetService: BudgetServiceService
  ) {}

  ngOnInit() {
    this.modalSS.$modal.subscribe((value) => {
      this.modalVisible = value;
    });

    this.expenseService.expenses$.subscribe((updatedExpenses) => {
      this.expenses = updatedExpenses;
      this.updateTotalGastos(); // Actualiza el total de gastos al recibir nuevos gastos
    });
  }

  openModal(expense?: Expense) {
    this.selectedExpense = expense || null;
    this.modalVisible = true;
  }

  deleteExpense(expenseId: number) {
    this.expenseService.deleteExpense(expenseId);
    this.updateTotalGastos(); // Actualiza el total de gastos al eliminar un gasto
  }

  updateExpense(expense: Expense) {
    this.expenseService.setSelectedExpense(expense);
    this.modalVisible = true;
  }

  totalGastosFormatted: string = '';
  private updateTotalGastos() {
    this.totalGastos = this.expenses.reduce(
      (total, expense) => total + expense.priceExpend,
      0
    );
    this.totalGastosFormatted = this.totalGastos.toLocaleString(); // Formatea el total
  }

  budget: Budget = { budget: 0 };
  saveBudget() {
    this.budgetService.addPresupuesto(this.budget);
  }

  onSubmit() {
    this.saveBudget();
  }
}
