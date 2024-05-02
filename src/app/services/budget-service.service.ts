import { Injectable } from '@angular/core';
import { Budget } from '../models/Budget';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetServiceService {
  private budgetSubject = new BehaviorSubject<Budget[]>([]);
  budgets$ = this.budgetSubject.asObservable();

  constructor() {
    this.loadInitialExpenses();
  }

  private totalPresupuestoSubject = new BehaviorSubject<number>(0);
  totaPresupuesto = this.totalPresupuestoSubject.asObservable();

  uptadeTotalPresupuesto(newTotalPresupuesto: number) {
    this.totalPresupuestoSubject.next(newTotalPresupuesto);
  }

  addPresupuesto(newPresupuesto: Budget) {
    const updtedBudget = [...this.budgetSubject.value, newPresupuesto];
    this.updtedBudget(updtedBudget);
  }

  private updtedBudget(budgets: Budget[]) {
    this.budgetSubject.next(budgets);
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }

  private loadInitialExpenses() {
    const budgetsFromStorage = JSON.parse(
      localStorage.getItem('budgets') || '[]'
    );
    this.budgetSubject.next(budgetsFromStorage);
  }
}
