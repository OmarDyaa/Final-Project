import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseUrl = environment.apiUrl ;
  private http =inject(HttpClient);
  cart =signal<Cart | null>(null);
  
  itemsCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  });

  totals = computed(() => {
    const cart = this.cart();
        if (!cart) return null;
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0;
        const discount = 0;
        return {
          subtotal,
          shipping,
          discount,
          total: subtotal + shipping - discount 
        };
    });

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id'+id).pipe(
    map(cart => {
      this.cart.set(cart);
      return cart;
  })
  )};
  
  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: (cart) => {
        this.cart.set(cart);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();

    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }

    cart.items = this.addOrUpdateItem(cart.items, item, quantity);

    
    this.setCart(cart);
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);

    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      quantity: 1,
      price: item.price,
      brand: item.brand,
      type: item.type,
      pictureUrl: item.pictureUrl
    };
  }

 



} 
