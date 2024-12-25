import {
    Product,
    productWithQty,
    tax,
  } from './food';
  
  export class Order{
    id!: string;
  orderId!: string;
  product!: Product[]
  productWithQty!: productWithQty[]
  needToPrintQty!: number;
  
  productId!: string;
  customerId!:string;
  
  points!: number;
  tax!:tax[];
  taxValue!: number;
  taxfake!:number;
  quantity!: number;
  // totalPrice!: number;
  orderStatus?:string;
  lineValueExclTax!: number;
  priceExclTax!:number
  lineValueTax!: number;
  paymentType!:string;
  lineValue!: number;
  
  units!: number;
  
  productName!: string;
  
  text!: string;
  static productWithQty: { productId: string; qty: number; price: number; }[];
  Color!: String;
  customername!:String;
  vehicle!:String;
  // subTotal!: number;
  OrderNo!: number;
  total!: number;
  subtotal!:number
  orderDateTime!:String;
  orderType!:string
  deliveryfee!:number
  selectedModifiers!: any;
  }
  
  
  
  export interface PaymentList  {
    _id?: string;
    name: string;
    paymentsGTypeId?: string;
    isActive?: boolean;
    defaultPayment?: boolean;
    showCaption?: boolean;
    created_at?:string
    updated_at?:string
  }
  