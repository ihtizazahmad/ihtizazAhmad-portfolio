import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintOrderService {
  private readonly orderStorageKey = 'printedOrders';
    constructor() { }
  
    addPrintedOrder(order: string) {
      const orders = this.getStoredOrders();
      orders.push(order);
      this.saveOrders(orders);
    }
  
    getPrintedOrders() {
      return this.getStoredOrders();
    }
  
    private getStoredOrders(): string[] {
      const storedOrders = localStorage.getItem(this.orderStorageKey);
      return storedOrders ? JSON.parse(storedOrders) : [];
    }
  
    private saveOrders(orders: string[]) {
      localStorage.setItem(this.orderStorageKey, JSON.stringify(orders));
    }

    deletePrintedOrder(index: number) {
        const orders = this.getStoredOrders();
        if (index >= 0 && index < orders.length) {
          orders.splice(index, 1); // Remove the order at the specified index
          this.saveOrders(orders);
        }
      }

      searchOrderByOrderNo(orderNo: string): string | null {
        const orders = this.getStoredOrders();
        const foundOrder = orders.find(order => order.includes(`Order No: ${orderNo}`));
        return foundOrder || null;
      }

    
}
