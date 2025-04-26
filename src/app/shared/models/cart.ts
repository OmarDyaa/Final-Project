import { nanoid } from "nanoid";
export type CartType={
    id: string;
    items: CartItem[];
  };
  
  export type CartItem = {
    
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    brand: string;
    type: string;
    pictureUrl: string;
  };
  
  export class Cart implements CartType{
      id= nanoid();
      items: CartItem[]=[];

  }