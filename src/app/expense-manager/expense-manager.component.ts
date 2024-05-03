import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { SwitchService } from '../services/switch.service';
import { Expense } from '../models/expense';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../services/expense-service.service';
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

  presupuesto: number = 0;
  presupuestoIngresado: number = 0;
  presupuestoGuardado: number = 0;
  saldoDisponibleGuardado: number = 0;
  saldoDisponible: number = 0;

  constructor(
    private modalSS: SwitchService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.modalSS.$modal.subscribe((value) => {
      this.modalVisible = value;
    });

    this.expenseService.expenses$.subscribe((updatedExpenses) => {
      this.expenses = updatedExpenses;
      this.updateTotalGastos(); // Actualiza el total de gastos al recibir nuevos gastos
    });

    
    const presupuesto = localStorage.getItem('presupuesto');
    if (presupuesto !== null) {
      this.presupuestoGuardado = JSON.parse(presupuesto);
    }
    
    const saldo = localStorage.getItem('saldo');
    if (saldo !== null) {
      this.saldoDisponibleGuardado = JSON.parse(saldo);
    }
    this.saldoDisponibleGuardado = this.presupuestoGuardado - this.totalGastos; 
  }

  openModal(expense?: Expense) {
    this.selectedExpense = expense || null;
    this.modalVisible = true;
  }

  deleteExpense(expenseId: number) {
    this.expenseService.deleteExpense(expenseId);
    this.updateTotalGastos(); // Actualiza el total de gastos al eliminar un gasto
    this.saldoDisponibleGuardado = this.presupuestoGuardado - this.totalGastos; 
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

  agregarPresupuesto() {
    this.presupuestoIngresado = this.presupuesto;
    this.saldoDisponible = this.presupuesto - this.totalGastos;

    localStorage.setItem(
      'presupuesto',
      JSON.stringify(this.presupuestoIngresado)
    );

    localStorage.setItem('saldo', JSON.stringify(this.saldoDisponible));

    window.location.reload();
  }
}
