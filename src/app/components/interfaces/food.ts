
export interface Product  {
    _id: string;
    categoryName:string;
    categoryParents: string;
    barCode: string;
    name: string;
    price: number;
    retailPrice: number;
    inHouseTaxValue?: number;
    takeawayTaxValue?: number;
    shortDescription: string;
    fullDescription: string;
    order: number;
    totalQuantity:number;
    quantity:number;
    subtotal:number;
    active: boolean;
    categoryId: string;
    inHouseTaxId: string;
    takeawayTaxId: string;
    hasPicture: boolean;
    productPictureId: any
    productType: any
    Product_pic:string
    userId:any
}
export interface productWithQty{
    price: number;
    productId: string;
    qty: number;
}
export interface tax{
  value: number;
  userId: any;
  byDefault: boolean;
  name:string;
  addtax:number;
}

