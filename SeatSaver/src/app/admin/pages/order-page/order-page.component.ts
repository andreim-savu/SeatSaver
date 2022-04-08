import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { IOrder } from '../../interfaces/order.interface';
import { OrdersService } from '../../services/orders.service';
import { firstNames, lastNames, restaurants } from '../../t';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {

  orders: IOrder[] = [];

  currentOrder: IOrder | undefined = undefined;

  
  ordersRef: Observable<any[]> | undefined;
  ordersRef2: Observable<any[]> | undefined;

  constructor(private db: AngularFirestore, private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.ordersRef = this.db.collection("Orders").valueChanges();
    this.ordersRef2 = this.db.collection("Orders").snapshotChanges();

    this.ordersRef.subscribe((res: any) => {
      console.log(res);
      this.orders = [...res];
      this.orders.map(order => {
        order.timePlaced = new Date((order.timePlaced as any).seconds * 1000);
        order.time = new Date((order.time as any).seconds * 1000);
      })
      this.orders.sort((a: any, b: any) => {return a.timePlaced.getTime() - b.timePlaced.getTime();})
    });

    this.ordersRef2.subscribe((res: any) => {
      console.log("######");
      console.log(res);
      console.log("######");
    });
    
    const newOrder: IOrder = {
      orderId: Math.random().toString(36).substr(2, 9),
      timePlaced: new Date(Date.now()),
      name: lastNames[Math.floor(Math.random() * lastNames.length)] + " " + firstNames[Math.floor(Math.random() * firstNames.length)],
      restaurant: restaurants[Math.floor(Math.random() * restaurants.length)].name,
      noPeople: Math.max(2, Math.floor(Math.random() * 10)),
      time: new Date(Date.now() + Math.random() * 100000000),
      status: "Pending"
    };
    
    this.addOrder(newOrder);

    // if (this.orders[0]) { this.currentOrder = this.orders[0]; }
    //this.loop();
  }

  loop(): void {
    setTimeout(() => {
      console.log(12);
      this.addOrder();
      this.loop();
    }, 200);
  }

  takeOrder(): void {
    if (Math.random() < 0.35) {
      this.orders.push({
        orderId: Math.random().toString(36).substr(2, 9),
        timePlaced: new Date(Date.now()),
        name: lastNames[Math.floor(Math.random() * lastNames.length)] + " " + firstNames[Math.floor(Math.random() * firstNames.length)],
        restaurant: restaurants[Math.floor(Math.random() * restaurants.length)].name,
        noPeople: Math.max(2, Math.floor(Math.random() * 10)),
        time: new Date(Date.now() + Math.random() * 100000000),
        status: "Pending"
      })
    }
  }

  manageOrders(): void {
    if (!this.currentOrder && this.orders.length) { 
      this.currentOrder = this.orders.find(element => { return element.status === "Pending"}); 
    }

    if (!this.currentOrder) { return; }

    if (Math.random() < 0.4) {
      this.currentOrder.status = Math.random() < 0.5 ? "Accepted" : "Declined";
      if (this.orders[this.orders.indexOf(this.currentOrder) + 1]) {
        this.currentOrder = this.orders[this.orders.indexOf(this.currentOrder) + 1];
      }
      else {
        this.currentOrder = undefined;
      }
      setTimeout(() => {
        this.orders.shift();
      }, 2000);
    }
  }

  getOrders(): void {

  }

  addOrder(order?: IOrder): void {
    if (!order) {
      const newOrder: IOrder = {
        orderId: Math.random().toString(36).substr(2, 9),
        timePlaced: new Date(Date.now()),
        name: lastNames[Math.floor(Math.random() * lastNames.length)] + " " + firstNames[Math.floor(Math.random() * firstNames.length)],
        restaurant: restaurants[Math.floor(Math.random() * restaurants.length)].name,
        noPeople: Math.max(2, Math.floor(Math.random() * 10)),
        time: new Date(Date.now() + Math.random() * 100000000),
        status: "Pending"
      };
      this.ordersService.addOrder(newOrder);
    }
    else {
      this.ordersService.addOrder(order);
    }
  }
}
