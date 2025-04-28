export interface Order {
    id: number
    orderDate: string
    buyerEmail: string
    shippingAddress: ShippingAddress
    deliveryMethod: DeliveryMethod
    paymentSummary: PaymentSummary
    orderItems: OrderItem[]
    subtotal: number
    discount: number
    status: number
    paymentIntentId: string
  }
  
  export interface ShippingAddress {
    name: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  
  export interface DeliveryMethod {
    shortName: string
    deliveryTime: string
    description: string
    price: number
    id: number
  }
  
  export interface PaymentSummary {
    last4: number
    brand: string
    expMonth: number
    expYear: number
  }
  
  export interface OrderItem {
    itemOrdered: ItemOrdered
    price: number
    quantity: number
    id: number
  }
  
  export interface ItemOrdered {
    productId: number
    productName: string
    pictureUrl: string
  }
  

  export interface OrderToCreate{
    cartId: string;
    deliveryMethodId: number;
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
  }