import { Product } from "./product";

export class cartItem{
    // static food: any;
    constructor(public food : Product){}
    quantity : number = 1;
    price : number= this.food.price;
}