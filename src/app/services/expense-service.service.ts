import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();
  private _selectedExpense: Expense | null = null;

  constructor() {
    this.loadInitialExpenses();
  }

  private totalGastosSubject = new BehaviorSubject<number>(0);
  totalGastos$ = this.totalGastosSubject.asObservable();

  updateTotalGastos(newTotal: number) {
    this.totalGastosSubject.next(newTotal);
  }

  // Método público para establecer el gasto seleccionado
  public setSelectedExpense(expense: Expense | null): void {
    this._selectedExpense = expense;
  }

  // Método público para obtener el gasto seleccionado
  public getSelectedExpense(): Expense | null {
    return this._selectedExpense;
  }

  addExpense(newExpense: Expense) {
    const updatedExpenses = [...this.expensesSubject.value, newExpense];
    this.updateExpenses(updatedExpenses);
  }

  updateExpense(updatedExpense: Expense) {
    const expenses = this.expensesSubject.value;
    const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      this.updateExpenses(expenses);
    }
  }

  deleteExpense(expenseId: number) {
    const updatedExpenses = this.expensesSubject.value.filter(expense => expense.id !== expenseId);
    this.updateExpenses(updatedExpenses);
  }

  private loadInitialExpenses() {
    const expensesFromStorage = JSON.parse(localStorage.getItem('expenses') || '[]');
    this.expensesSubject.next(expensesFromStorage);
  }

  private updateExpenses(expenses: Expense[]) {
    this.expensesSubject.next(expenses);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }
}
