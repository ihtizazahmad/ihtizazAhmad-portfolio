export interface Product  {
    _id: string;
    categoryName:string;
    categoryParents: string;
    barCode: string;
    name: string;
    modifiers:any;
    price: number;
    retailPrice: number;
    inHouseTaxValue?: number;
    takeawayTaxValue?: number;
    shortDescription: string;
    fullDescription: string;
    order: number;
    totalQuantity:number;
    quantity:number;
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


// export class ProductClass {
//   _id: string;
//   categoryName:string;
//   categoryParents: string;
//   barCode: string;
//   name: string;
//   totalQuantity:number;
//   quantity:number;
//   price: number;
//   retailPrice: number;
//   inHouseTaxValue: number;
//   takeawayTaxValue: number;
//   shortDescription: string;
//   fullDescription: string;
//   order: number;
//   active: boolean;
//   categoryId: string;
//   inHouseTaxId: string;
//   takeawayTaxId: string;
//   hasPicture: boolean;
//   productPictureId: any
//   productType: any
// }
