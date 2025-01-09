import { cartItem } from "./cartitem";

export class cart{
    items: cartItem[] = [];
    totalPrice: number = 0;
    totalCount: number = 0 ;
    modifierPrice: number = 0;
    subtotal: number = 0;
    tax: any ;
    taxvalue: number = 0;
}