import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private ordersCollection!: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) { 
    this.ordersCollection = db.collection<any>('Orders');
  }

  getOrders() {
    return this.db.collection("Orders").snapshotChanges().subscribe(res => {
      console.log(res);
    });
  }

  addOrder(order: IOrder) {
    return this.ordersCollection.add(order);
  }

  dateToTimestamp(date: Date): any {
    return { 
      seconds: date.getTime()/1000,
      nanoseconds: date.getTime()/1000000
    }
  }
}
